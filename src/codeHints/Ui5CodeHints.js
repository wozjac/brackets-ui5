define((require, exports, module) => {
    "use strict";

    const HintUtils = brackets.getModule("JSUtils/HintUtils"),
        Session = brackets.getModule("JSUtils/Session"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        ScopeManager = brackets.getModule("JSUtils/ScopeManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        ui5ApiService = require("src/core/ui5ApiService"),
        strings = require("strings"),
        hintsSorter = require("src/codeHints/hintsSorter"),
        hintsRenderer = require("src/codeHints/hintsRenderer"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        Ui5CodeAnalyzer = require("src/code/Ui5CodeAnalyzer"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        astTool = require("src/code/astTool"),
        codeEditor = require("src/editor/codeEditor"),
        textTool = require("src/editor/textTool"),
        prefs = require("src/main/preferences"),
        constants = require("src/core/constants");

    Session.prototype._getContextToken = function (cursor, depth) {
        const token = this.getToken(cursor);

        if (depth === undefined) {
            depth = 0;
        }

        if (token.string === ")") {
            this._getPreviousToken(cursor);
            return this._getContextToken(cursor, ++depth);
        } else if (token.string === "(") {
            this._getPreviousToken(cursor);
            return this._getContextToken(cursor, --depth);
        } else
        if (depth > 0 || token.string === ".") {
            this._getPreviousToken(cursor);
            return this._getContextToken(cursor, depth);
        } else {
            return token;
        }
    };

    let session;

    class Ui5CodeHints {
        static initializeSession(editor, previousEditor) {
            if (editor) {
                session = new Session(editor);
                ScopeManager.handleEditorChange(session, editor.document,
                    previousEditor ? previousEditor.document : null);
            }
        }

        static handleActiveEditorChange(event, currentEditor, previousEditor) {
            Ui5CodeHints.initializeSession(currentEditor, previousEditor);
        }

        constructor() {
            this.cachedQuery = null;
            this.cachedUi5ObjectApi = null;
            this.cachedUi5Object = null;
            this.objectIdentifierToken = null;
            this.objectIdentifier = null;
            this.inDefineArrayHint = false;
            this.defineStatementPositions = null;
        }

        hasHints(editor, implicitChar) {
            this._reset();
            this.editor = editor;

            if (!session) {
                Ui5CodeHints.initializeSession(editor);
                EditorManager.on(HintUtils.eventName("activeEditorChange"), Ui5CodeHints.handleActiveEditorChange);
            }

            const cursorPosition = session.getCursor();
            this.queryToken = session.getToken(cursorPosition);

            if (this._cursorInsideDefineArray(editor, cursorPosition)) {
                if (this.queryToken.string.trim() !== "" && this.queryToken.string !== "[") {
                    this.inDefineArrayHint = true;
                    return true;
                } else {
                    return false;
                }
            }

            if (!HintUtils.hintableKey(implicitChar, true)) {
                return false;
            }

            if (this.queryToken && HintUtils.hintable(this.queryToken)) {
                if (this.queryToken.string === ".") {
                    this.objectIdentifierToken = session._getPreviousToken(cursorPosition);
                    this.objectIdentifier = this.objectIdentifierToken.string.trim();
                } else if (this.queryToken.string.endsWith(".")) {
                    this.objectIdentifierToken = this.queryToken;
                    this.objectIdentifier = this.queryToken.string.trim().slice(0, -1);
                } else {
                    const dotCursor = session.findPreviousDot();

                    if (dotCursor) {
                        const previous = session._getPreviousToken(dotCursor);

                        if (previous && previous.string === ")") {
                            this.objectIdentifierToken = previous;
                            this.objectIdentifier = this.objectIdentifierToken.string.trim();
                        } else {
                            this.objectIdentifierToken = session._getContextToken(dotCursor);
                            this.objectIdentifier = this.objectIdentifierToken.string;
                        }
                    }
                }

                if (this.objectIdentifier) {
                    return true;
                }
            }

            return false;
        }

        getHints() {
            if (CodeHintManager.isOpen()) {
                return null;
            }

            const defrerred = $.Deferred(); //eslint-disable-line

            if (this.inDefineArrayHint) {
                this.queryToken.string = this.queryToken.string
                    .replace(/['"]/g, "")
                    .replace(/\//g, ".")
                    .replace(/[",[\]()]/g, "")
                    .trim();

                let ui5Objects = ui5ApiFinder.findUi5ApiObjects({
                    name: `^${this.queryToken.string}.*`
                });

                if (ui5Objects && ui5Objects.length > 0) {
                    ui5Objects = ui5Objects.slice(0, 30);
                    const hintsObject = this._resolveWithDefineObjects(ui5Objects);
                    defrerred.resolveWith(null, [hintsObject]);
                } else {
                    defrerred.reject();
                }

                return defrerred;
            }

            const position = {
                line: session.getCursor().line,
                ch: this.objectIdentifierToken.start,
                chEnd: this.objectIdentifierToken.end
            };

            const codeAnalyzer = new Ui5CodeAnalyzer(this.editor.document.getText());

            codeAnalyzer.resolveUi5Token(this.objectIdentifier, position, true).then((results) => {
                if (results.length === 0) {
                    defrerred.reject();
                    return;
                }

                let hintsObject;
                this.proposedUi5Object = results[0];

                if (!this.proposedUi5Object) {
                    defrerred.reject();
                    return;
                }

                if (this.proposedUi5Object === this.cachedUi5Object
                    && this.queryToken.string === this.cachedQuery) {

                    //FIXME: restore event handlers for cached events
                    //return this._resolveWithCachedHints();
                    this.cachedUi5Object = this.proposedUi5Object;
                    this.cachedQuery = this.queryToken.string;
                    hintsObject = this._resolveWithCachedApiObject();
                } else if (this.proposedUi5Object === this.cachedUi5Object
                    && this.queryToken.string !== this.cachedQuery) {

                    hintsObject = this._resolveWithCachedApiObject();
                } else {
                    hintsObject = this._resolveWithApiObjectSearch();
                }

                this.cachedUi5Object = this.proposedUi5Object;
                this.cachedQuery = this.queryToken.string;

                defrerred.resolveWith(null, [hintsObject]);
                return;
            }, (error) => {
                console.log(`[wozjac.ui5] ${error}`);
                defrerred.reject();
                return;
            });

            return defrerred;
        }

        insertHint(hintObject) {
            let textToInsert = hintObject.find("span.brackets-ui5-hint-name").text();
            const cursor = session.getCursor(),

                start = {
                    line: cursor.line,
                    ch: cursor.ch - this.queryToken.string.length
                },

                end = {
                    line: cursor.line,
                    ch: cursor.ch
                };

            if (!session.getFunctionInfo().inFunctionCall
                && hintObject._ui5Type === strings.METHOD) {

                textToInsert += "(";

                if (prefs.get(constants.prefs.INSERT_METHOD_SIGNATURE) && hintObject._ui5Parameters) {
                    for (let i = 0; i < hintObject._ui5Parameters.length; i++) {
                        textToInsert += hintObject._ui5Parameters[i].name;

                        if (hintObject._ui5Parameters.length > 1 && i < hintObject._ui5Parameters.length - 1) {
                            textToInsert += ",";
                        }
                    }
                }

                textToInsert += ")";
            }

            if (this.queryToken.string === ".") {
                start.ch++;
            }

            if (this.inDefineArrayHint) {
                if (this.queryToken.string.startsWith("'")
                    || this.queryToken.string.startsWith("\"")) {

                    start.ch += 2;
                }

                textToInsert = textToInsert.replace(/\./g, "/");
                //additionally insert object into function arguments
                this._insertObjectNameInDefineFunction(textToInsert);
            }

            this.editor.document.replaceRange(textToInsert, start, end);
        }

        _resolveWithCachedHints() {
            return {
                hints: this.cachedHints,
                match: null,
                selectInitial: true,
                handleWideResults: false
            };
        }

        _resolveWithCachedApiObject() {
            const formattedApi = ui5ApiFormatter.getFormattedObjectApi(this.cachedUi5ObjectApi, false, false, true);
            const result = this._findObjectMembers(this.queryToken.string, formattedApi);

            this.cachedHints = result;

            return {
                hints: result,
                match: null,
                selectInitial: true,
                handleWideResults: false
            };
        }

        _resolveWithApiObjectSearch() {
            const api = ui5ApiService.getUi5ObjectDesignApi(this.proposedUi5Object.name);

            //TODO: add library objects in this object namespace if valid
            //const ui5Objects = ui5ApiFinder.findUi5ApiObjects({
            //  name: this.proposedUi5Object.name + "."
            //});

            const formattedApi = ui5ApiFormatter.getFormattedObjectApi(api, false, false, true);
            const result = this._findObjectMembers(this.queryToken.string, formattedApi);

            this.cachedHints = result;
            this.cachedUi5ObjectApi = api;

            return {
                hints: result,
                match: null,
                selectInitial: true,
                handleWideResults: false
            };
        }

        _resolveWithDefineObjects(defineObjects) {
            const hintList = defineObjects.map(hintsRenderer.createLibraryObjectHintEntry);

            return {
                hints: hintList,
                match: null,
                selectInitial: true,
                handleWideResults: false
            };
        }

        _findObjectMembers(query, apiObject) {
            if (query === ".") {
                return this._searchMembers(apiObject, (element) => {
                    return element.visibility === "public";
                });
            } else {
                return this._searchMembers(apiObject, (element) => {
                    return element.visibility === "public"
                        && element.name.toLowerCase().startsWith(query.toLowerCase());
                });
            }
        }

        _searchMembers(apiObject, filterCallback) {
            let properties = [],
                methods = [];

            if (apiObject.properties) {
                properties = this._prepareMembers(apiObject.properties, apiObject, filterCallback, strings.PROPERTY);
            }

            if (apiObject.methods) {
                methods = this._prepareMembers(apiObject.methods, apiObject, filterCallback, strings.METHOD);
            }

            properties.push(...methods);

            return properties.sort(hintsSorter.sortWrappedHintList);
        }

        _prepareMembers(members, apiObject, filterCallback, type) {
            let parent, parentMembers;

            members = members.filter(filterCallback);

            if (apiObject.inheritedApi) {
                for (const objectKey in apiObject.inheritedApi) {
                    parent = apiObject.inheritedApi[objectKey];

                    switch (type) {
                        case strings.PROPERTY:
                            if (parent.properties) {
                                parentMembers = parent.properties;
                            }

                            break;

                        case strings.METHOD:
                            if (parent.methods) {
                                parentMembers = parent.methods;
                            }

                            break;
                    }

                    if (parentMembers) {
                        parentMembers = parentMembers.map((element) => {
                            element.borrowedFrom = objectKey;
                            return element;
                        });

                        parentMembers = parentMembers.filter(filterCallback);

                        let originMember, parentMember;

                        for (const i in parentMembers) {
                            parentMember = parentMembers[i];

                            originMember = members.find((element) => {
                                return element.name === parentMember.name;
                            });

                            if (originMember === undefined) {
                                members.push(parentMember);
                            }
                        }

                        parentMembers = null;
                    }
                }
            }

            members = members.map(hintsRenderer.createObjectMembersHintEntry(type));

            return members;
        }

        _cursorInsideDefineArray(editor, cursorPosition) {
            const sourceCode = codeEditor.getSourceCode(editor.document);
            const ast = astTool.parse(sourceCode);
            const cursorIndex = textTool.getIndexFromPosition(sourceCode, cursorPosition);
            const definePositions = astTool.getDefineStatementPositions(ast, sourceCode);

            if (definePositions && cursorIndex >= definePositions.arrayStartIndex && cursorIndex <= definePositions.arrayEndIndex) {
                this.defineStatementPositions = definePositions;
                this.cursorIndex = cursorIndex;
                return true;
            }

            return false;
        }

        _reset() {
            this.objectIdentifierToken = null;
            this.objectIdentifier = null;
            this.proposedUi5Object = null;
            this.inDefineArrayHint = false;
            this.defineStatementPositions = null;
        }

        _insertObjectNameInDefineFunction(defineArrayObjectName) {
            if (this.defineStatementPositions && !this.defineStatementPositions.noFunction && defineArrayObjectName) {
                let defineArrayTokens = this.defineStatementPositions.defineArrayTokens;
                const defineFunctionTokens = this.defineStatementPositions.defineFunctionTokens;
                const parts = defineArrayObjectName.split("/");
                let textToInsert = parts[parts.length - 1];
                let insertObjectPosition, referenceToken;

                //new element is always +1 to array elements if added as ".."
                if (defineArrayTokens) {
                    defineArrayTokens = defineArrayTokens.filter((element) => {
                        let isCursorInsideEmptyQuotes = false;

                        if (element.value === "" && this.cursorIndex > element.start && this.cursorIndex < element.end) {
                            isCursorInsideEmptyQuotes = true;
                        }

                        if (!isCursorInsideEmptyQuotes) {
                            return element;
                        }
                    });
                }

                if (defineArrayTokens && defineFunctionTokens && defineArrayTokens.length > 0) {
                    let previousToken;

                    for (const [index, element] of defineArrayTokens.entries()) {
                        if (index === 0 && this.cursorIndex < element.start) { //before first
                            referenceToken = defineFunctionTokens[index];

                            insertObjectPosition = {
                                line: referenceToken.loc.start.line - 1,
                                ch: referenceToken.loc.start.column
                            };

                            textToInsert += ", ";
                        } else if (previousToken && this.cursorIndex > previousToken.end && this.cursorIndex < element.start) { //between some tokens
                            referenceToken = defineFunctionTokens[index - 1];

                            insertObjectPosition = {
                                line: referenceToken.loc.end.line - 1,
                                ch: referenceToken.loc.end.column
                            };

                            textToInsert = `, ${textToInsert}`;
                        } else if (this.cursorIndex > element.start && this.cursorIndex < element.end) { //in the partial token
                            if (defineFunctionTokens.length > 0) {
                                referenceToken = defineFunctionTokens[index - 1];

                                insertObjectPosition = {
                                    line: referenceToken.loc.end.line - 1,
                                    ch: referenceToken.loc.end.column
                                };

                                textToInsert = `, ${textToInsert}`;
                            } else {
                                const location = this.defineStatementPositions.functionEndLocation;

                                insertObjectPosition = {
                                    line: location.end.line - 1,
                                    ch: location.end.column
                                };
                            }
                        } else if (index === defineArrayTokens.length - 1 && this.cursorIndex > element.end) { //after all
                            referenceToken = defineFunctionTokens[index];

                            insertObjectPosition = {
                                line: referenceToken.loc.end.line - 1,
                                ch: referenceToken.loc.end.column
                            };

                            textToInsert = `, ${textToInsert}`;
                        }

                        if (insertObjectPosition) {
                            this.editor.document.replaceRange(textToInsert, insertObjectPosition);
                            return;
                        }

                        previousToken = element;
                    }
                } else if (this.defineStatementPositions.functionEndIndex) { //empty define function
                    const parts = defineArrayObjectName.split("/");
                    const location = this.defineStatementPositions.functionEndLocation;

                    insertObjectPosition = {
                        line: location.end.line - 1,
                        ch: location.end.column
                    };

                    this.editor.document.replaceRange(parts[parts.length - 1], insertObjectPosition);
                }
            }
        }
    }

    module.exports = Ui5CodeHints;
});
