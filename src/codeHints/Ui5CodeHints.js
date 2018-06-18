define((require, exports, module) => {
    "use strict";

    const HintUtils = brackets.getModule("JSUtils/HintUtils"),
        Session = brackets.getModule("JSUtils/Session"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        ScopeManager = brackets.getModule("JSUtils/ScopeManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        ui5ApiService = require("src/core/ui5ApiService"),
        strings = require("strings"),
        hintUtils = require("src/codeHints/hintsUtils"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        codeAnalyzer = require("src/editor/codeAnalyzer");

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
                EditorManager.on(HintUtils.eventName("activeEditorChange"),
                    Ui5CodeHints.handleActiveEditorChange);
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
                        this.proposedUi5Object = codeAnalyzer.resolveUi5Token(
                            this.objectIdentifier, position,
                            this.editor.document.getText(), true)[0];

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
                const deferredResult = $.Deferred(); //eslint-disable-line new-cap

                if (this.useCachedHints === true
                    && this.useCachedUi5ObjectApi === true) {

                    this._resolveWithCachedHints(deferredResult);
                } else if (this.useCachedHints === false
                    && this.useCachedUi5ObjectApi === true) {

                    this._resolveWithCachedApiObject(deferredResult);
                } else {
                    this._resolveWithApiObjectSearch(deferredResult);
                }

                return deferredResult;
            } else {
                return null;
            }
        }

        insertHint(hintObject) {
            let textToInsert = hintObject.contents().not(hintObject.children()).text();
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
            let properties = [];

            if (apiObject.properties) {
                properties = apiObject.properties.filter(filterCallback);
                properties = properties.map(this._createEntry(strings.PROPERTY));
            }

            let methods = [];

            if (apiObject.methods) {
                methods = apiObject.methods.filter(filterCallback);
                methods = methods.map(this._createEntry(strings.METHOD));
            }

            properties.push(...methods);

            return properties.sort(hintUtils.sortWrappedHintList);
        }

        _resolveWithCachedHints(deferredObject) {
            deferredObject.resolveWith(null, [{
                hints: this.cachedHints,
                match: null,
                selectInitial: true,
                handleWideResults: false
            }]);
        }

        _resolveWithCachedApiObject(deferredObject) {
            const formattedApi = ui5ApiFormatter.getFormattedObjectApi(this.cachedUi5ObjectApi);
            const result = this._findObjectMembers(this.queryToken.string, formattedApi);

            this.cachedHints = result;

            deferredObject.resolveWith(null, [{
                hints: result,
                match: null,
                selectInitial: true,
                handleWideResults: false
            }]);
        }

        _resolveWithApiObjectSearch(deferredObject) {
            ui5ApiService.getUi5ObjectDesignApi(this.proposedUi5Object.path).then((ui5ObjectApi) => {
                const formattedApi = ui5ApiFormatter.getFormattedObjectApi(ui5ObjectApi);
                const result = this._findObjectMembers(this.queryToken.string, formattedApi);

                this.cachedHints = result;
                this.cachedUi5ObjectApi = ui5ObjectApi;

                deferredObject.resolveWith(null, [{
                    hints: result,
                    match: null,
                    selectInitial: true,
                    handleWideResults: false
                }]);

            }, (error) => {
                deferredObject.reject();
                console.error(`[wozjac.ui5] ${error}`);
            });
        }

        _createEntry(type) {
            return function (apiObject) {
                const entryElement = $("<span>").addClass("brackets-js-hints");
                entryElement.text(apiObject.name);
                entryElement.addClass("brackets-js-hints-with-type-details");
                $(`<span>${type}</span>`).appendTo(entryElement).addClass("brackets-js-hints-keyword");

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
