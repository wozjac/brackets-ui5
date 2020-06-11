define((require, exports, module) => {
    "use strict";

    const HintUtils = brackets.getModule("JSUtils/HintUtils"),
        Session = brackets.getModule("JSUtils/Session"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        strings = require("strings"),
        hintsRenderer = require("src/codeHints/hintsRenderer"),
        ui5CodeAnalyze = require("src/code/ui5CodeAnalyze"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        astTool = require("src/code/astTool"),
        codeEditor = require("src/editor/codeEditor"),
        textTool = require("src/editor/textTool"),
        prefs = require("src/main/preferences"),
        constants = require("src/core/constants");

    let session;

    class Ui5CodeHints {
        constructor() {
            this._queryToken = null;
            this._editor = null;
            this._inDefineArrayHint = false;
            this._defineStatementPositions = null;
        }

        hasHints(editor, implicitChar) {
            this._reset();
            this._editor = editor;
            session = new Session(editor);

            const cursorPosition = session.getCursor();
            this._queryToken = session.getToken(cursorPosition);

            if (this._cursorInsideDefineArray(editor, cursorPosition)) {
                if (this._queryToken.string.trim() !== ""
                    && this._queryToken.string !== "["
                    && this._queryToken.string !== ",") {

                    this._inDefineArrayHint = true;
                    return true;
                } else {
                    return false;
                }
            }

            if (!HintUtils.hintableKey(implicitChar, true)) {
                return false;
            }

            return true;
        }

        getHints() {
            if (CodeHintManager.isOpen()) {
                return null;
            }

            const deferred = $.Deferred(); //eslint-disable-line

            if (this._inDefineArrayHint) {
                this._queryToken.string = this._queryToken.string
                    .replace(/['"]/g, "")
                    .replace(/\//g, ".")
                    .replace(/[",[\]()]/g, "")
                    .trim();

                let ui5Objects = ui5ApiFinder.findUi5ApiObjects({
                    name: `^${this._queryToken.string}.*`
                });

                if (ui5Objects && ui5Objects.length > 0) {
                    ui5Objects = ui5Objects.slice(0, 30);
                    const hintsObject = this._resolveWithDefineObjects(ui5Objects);
                    deferred.resolveWith(null, [hintsObject]);
                } else {
                    deferred.reject();
                }

                return deferred;
            }

            ui5CodeAnalyze.getUi5Hints(this._editor)
                .then((hints) => {
                    if (hints) {
                        const result = hints.map((element) => {
                            return hintsRenderer.createHintCompletionEntry(element);
                        });

                        deferred.resolveWith(null, [{
                            hints: result,
                            match: null,
                            selectInitial: true,
                            handleWideResults: false
                        }]);

                        return true;
                    } else {
                        deferred.reject();
                        return;
                    }
                })
                .catch((error) => {
                    console.error(`[wozjac.ui5] ${error}`);
                    deferred.reject();
                    return;
                });

            return deferred;
        }

        insertHint(hintObject) {
            let textToInsert = hintObject.find("span.brackets-ui5-hint-name").text();
            const cursor = session.getCursor(),

                start = {
                    line: cursor.line,
                    ch: cursor.ch - this._queryToken.string.length
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

            if (this._queryToken.string === ".") {
                start.ch++;
            }

            if (this._inDefineArrayHint) {
                if (this._queryToken.string.startsWith("'")
                    || this._queryToken.string.startsWith("\"")) {

                    start.ch += 2;
                }

                textToInsert = textToInsert.replace(/\./g, "/");
                //additionally insert object into function arguments
                this._insertObjectNameInDefineFunction(textToInsert);
            }

            this._editor.document.replaceRange(textToInsert, start, end);
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
                            this._editor.document.replaceRange(textToInsert, insertObjectPosition);
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

                    this._editor.document.replaceRange(parts[parts.length - 1], insertObjectPosition);
                }
            }
        }

        _reset() {
            this._inDefineArrayHint = false;
            this._defineStatementPositions = null;
        }
    }

    module.exports = Ui5CodeHints;
});
