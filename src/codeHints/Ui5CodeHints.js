define((require, exports, module) => {
    "use strict";

    const HintUtils = brackets.getModule("JSUtils/HintUtils"),
        Session = brackets.getModule("JSUtils/Session"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        ScopeManager = brackets.getModule("JSUtils/ScopeManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        ui5ApiService = require("src/core/ui5ApiService"),
        codeEditor = require("src/editor/codeEditor"),
        strings = require("strings"),
        hintUtils = require("src/codeHints/hintsUtils"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        Ui5CodeAnalyzer = require("src/code/Ui5CodeAnalyzer");

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
            this.useCachedHints = false;
            this.useCachedUi5ObjectApi = false;
        }

        hasHints(editor, implicitChar) {
            this._reset();
            this.editor = editor;

            if (!session) {
                Ui5CodeHints.initializeSession(editor);
                EditorManager.on(HintUtils.eventName("activeEditorChange"), Ui5CodeHints.handleActiveEditorChange);
            }

            if (!HintUtils.hintableKey(implicitChar, true)) {
                return false;
            }

            const cursorPosition = session.getCursor();
            this.queryToken = session.getToken(cursorPosition);

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
                        this.objectIdentifierToken = session._getContextToken(dotCursor);
                        this.objectIdentifier = this.objectIdentifierToken.string;
                    }
                }

                if (this.objectIdentifier) {
                    const position = {
                        line: session.getCursor().line,
                        ch: this.objectIdentifierToken.start
                    };

                    try {
                        const codeAnalyzer = new Ui5CodeAnalyzer(editor.document.getText());

                        this.proposedUi5Object = codeAnalyzer.resolveUi5Token(
                            this.objectIdentifier, position, true
                        )[0];

                        if (this.proposedUi5Object === this.cachedUi5Object
                            && this.queryToken.string === this.cachedQuery) {

                            this.useCachedHints = true;
                            this.useCachedUi5ObjectApi = true;
                        } else if (this.proposedUi5Object === this.cachedUi5Object
                            && this.queryToken.string !== this.cachedQuery) {

                            this.useCachedUi5ObjectApi = true;
                            this.useCachedHints = false;
                        } else {
                            this.useCachedUi5ObjectApi = false;
                            this.useCachedHints = false;
                        }

                        if (this.proposedUi5Object) {
                            this.cachedUi5Object = this.proposedUi5Object;
                            this.cachedQuery = this.queryToken.string;
                            return true;
                        }

                    } catch (error) {
                        console.error(`[wozjac.ui5] ${error}`);
                    }
                }
            }

            return false;
        }

        getHints() {
            if (CodeHintManager.isOpen()) {
                return null;
            }

            if (this.proposedUi5Object) {
                if (this.useCachedHints === true
                    && this.useCachedUi5ObjectApi === true) {

                    //FIXME: restore event handlers for cached events
                    //return this._resolveWithCachedHints();
                    return this._resolveWithCachedApiObject();
                } else if (this.useCachedHints === false
                    && this.useCachedUi5ObjectApi === true) {

                    return this._resolveWithCachedApiObject();
                } else {
                    return this._resolveWithApiObjectSearch();
                }
            } else {
                return null;
            }
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

                if (hintObject._ui5Parameters) {
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

            this.editor.document.replaceRange(textToInsert, start, end);
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

            return properties.sort(hintUtils.sortWrappedHintList);
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

            members = members.map(this._createEntry(type));

            return members;
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
            const formattedApi = ui5ApiFormatter.getFormattedObjectApi(this.cachedUi5ObjectApi);
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
            const formattedApi = ui5ApiFormatter.getFormattedObjectApi(api);
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

        _createEntry(type) {
            return function (apiObject) {
                const entryElement = $("<span>").addClass("brackets-js-hints");
                entryElement.addClass("brackets-js-hints-with-type-details");
                $("<span></span>").text(apiObject.name).appendTo(entryElement).addClass("brackets-ui5-hint-name");

                const documentationLink = $("<a></a>").attr("href", apiObject.apiDocUrl);
                documentationLink.addClass("jshint-link brackets-ui5-hint-doc-link");
                documentationLink.appendTo(entryElement);

                documentationLink.click((event) => {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                });

                if (type === strings.PROPERTY) {
                    $("<span></span>").text(apiObject.type).appendTo(entryElement).addClass("jshint-jsdoc brackets-ui5-hint-type");
                }

                if (type === strings.METHOD) {
                    let returnText, methodSignature, parameter, parametersText = "";

                    if (apiObject.parameters) {
                        for (let i = 1; i <= apiObject.parameters.length; i++) {
                            parameter = apiObject.parameters[i - 1];
                            parametersText += `${parameter.name} : <span class="brackets-ui5-hint-member-type">${parameter.type}</span>`;

                            if (i !== apiObject.parameters.length) {
                                parametersText += ", ";
                            }
                        }
                    }

                    methodSignature = `fn(${parametersText})`;

                    if (apiObject.returnValue) {
                        if (apiObject.returnValue instanceof Object) {
                            returnText = apiObject.returnValue.type;
                        } else {
                            returnText = apiObject.returnValue;
                        }

                        methodSignature += ` : <span class="brackets-ui5-hint-member-type">${returnText}</span>`;
                    }

                    $("<span></span>").html(methodSignature).appendTo(entryElement).addClass("jshint-jsdoc brackets-ui5-hint-type");
                }

                if (apiObject.borrowedFrom) {
                    $("<span></span>").text(`↑ borrowed from ${apiObject.borrowedFrom} ↑`).addClass("jshint-jsdoc brackets-ui5-hint-borrowed").appendTo(entryElement);
                }

                if (apiObject.description) {
                    $("<span></span>").text(apiObject.description.trim()).appendTo(entryElement).addClass("jshint-jsdoc");
                }

                entryElement._ui5Type = type;

                if (type === strings.METHOD && apiObject.parameters) {
                    entryElement._ui5Parameters = apiObject.parameters;
                }

                return entryElement;
            };
        }

        _reset() {
            this.objectIdentifierToken = null;
            this.objectIdentifier = null;
            this.useCachedHints = false;
            this.useCachedUi5ObjectApi = false;
            this.proposedUi5Object = null;
        }
    }

    module.exports = Ui5CodeHints;
});
