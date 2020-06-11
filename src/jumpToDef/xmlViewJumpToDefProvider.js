define((require, exports) => {

    const EditorManager = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        codeEditor = require("src/editor/codeEditor"),
        i18nTool = require("src/code/i18nTool"),
        xmlExtract = require("src/code/xmlExtract"),
        strings = require("strings"),
        ui5CodeSearch = require("src/code/ui5CodeSearch"),
        constants = require("src/core/constants"),
        ui5Files = require("src/ui5Project/ui5Files");

    class XmlViewJumpToDefProvider {
        constructor() {
            this.editor = null;
            this.selection = null;
        }

        canJumpToDef(editor) {
            if (editor.getModeForSelection() !== "xml") {
                return false;
            }

            // no multiline selection
            this.selection = editor.getSelection();

            if (this.selection.start.line !== this.selection.end.line) {
                return false;
            }

            this.editor = editor;
            return true;
        }

        doJumpToDef() {
            const i18nInfo = i18nTool.getI18nInfoFromAttribute(this.editor, this.selection.start);

            if (i18nInfo) {
                return _handleI18nJump(i18nInfo);
            } else {
                //function?
                const position = this.editor.getCursorPos();
                const token = codeEditor.getToken(position, this.editor);
                let functionName = xmlExtract.getFunctionNameFromXmlViewElement(token.string);
                functionName = functionName.split(".").pop();
                const controllerName = xmlExtract.getControllerName(this.editor.document.getText());

                if (!functionName) {
                    return null;
                }

                return _handleFunctionJump(functionName, controllerName);
            }
        }
    }

    function _handleI18nJump(i18nInfo) {
        const result = new $.Deferred();
        let i18nDocument, i18nFile;

        ui5Files.getModelInfo(i18nInfo.modelName)
            .then((modelInfo) => {
                i18nFile = modelInfo;
                return DocumentManager.getDocumentForPath(modelInfo.path);
            })
            .then(() => {
                return ui5Files.openFile(i18nFile.path);
            })
            .then((document) => {
                i18nDocument = document;
                return i18nTool.getEntryRange(i18nInfo, i18nDocument);
            })
            .then((rangeInfo) => {
                const newEditor = EditorManager.getActiveEditor();

                if (rangeInfo && rangeInfo.lineStart) {
                    const cursorEndPosition = i18nDocument.getLine(rangeInfo.lineStart).length;
                    newEditor.setCursorPos(rangeInfo.lineStart, cursorEndPosition, true);
                } else {
                    const lines = i18nDocument.getText().split(/\n/).length;
                    newEditor.setCursorPos(lines, 0);
                }

                result.resolve();
            })
            .catch((error) => {
                console.log(error);
                result.reject(error);
            });

        return result.promise();
    }

    function _handleFunctionJump(functionName, controllerName) {
        const result = new $.Deferred();

        ui5CodeSearch.findFunctionInController(functionName, controllerName)
            .then((matchingFunctionInfo) => {
                _openFileOnFunction(matchingFunctionInfo)
                    .then(() => {
                        result.resolve();
                    }, (error) => {
                        result.reject(error);
                    });

            })
            .catch((error) => {
                switch (error) {
                    case "NOT_FOUND":
                        return ui5CodeSearch.findFunctionInFiles(functionName, constants.regex.controllerFilesRegex);
                    case "MULTIPLE_FOUND":
                        console.info(`${strings.MULTIPLE_FUNCTIONS_FOUND} ${functionName}`);
                        result.reject();
                        break;
                    default:
                        result.reject();
                }
            })
            .then((matchingFunctionInfo) => {
                _openFileOnFunction(matchingFunctionInfo)
                    .then(() => {
                        result.resolve();
                    }, (error) => {
                        result.reject(error);
                    });
            })
            .catch((error) => {
                switch (error) {
                    case "NOT_FOUND":
                        return ui5CodeSearch.findFunctionInFiles(functionName, constants.regex.jsFilesRegex);
                    case "MULTIPLE_FOUND":
                        console.info(`${strings.MULTIPLE_FUNCTIONS_FOUND} ${functionName}`);
                        result.reject();
                        break;
                    default:
                        result.reject(error);
                }
            })
            .then((matchingFunctionInfo) => {
                _openFileOnFunction(matchingFunctionInfo)
                    .then(() => {
                        result.resolve();
                    }, (error) => {
                        result.reject(error);
                    });
            })
            .catch((error) => {
                switch (error) {
                    case "NOT_FOUND":
                        result.reject();
                        break;
                    case "MULTIPLE_FOUND":
                        console.info(`${strings.MULTIPLE_FUNCTIONS_FOUND} ${functionName}`);
                        result.reject();
                        break;
                    default:
                        result.reject(error);
                }
            });

        return result.promise();
    }

    function _openFileOnFunction(matchingFunctionInfo, functionRangeInfo) {
        return new Promise((resolve, reject) => {
            ui5Files.openFile(matchingFunctionInfo.document.file.fullPath)
                .then(() => {
                    _setCursorOnFunction(matchingFunctionInfo, functionRangeInfo);
                    resolve();
                })
                .catch(() => {
                    reject("ERROR");
                });
        });
    }

    function _setCursorOnFunction(matchingFunctionInfo) {
        const newEditor = EditorManager.getActiveEditor();
        const cursorEndPosition = matchingFunctionInfo.document.getLine(matchingFunctionInfo.lineStart).length;
        newEditor.setCursorPos(matchingFunctionInfo.lineStart, cursorEndPosition, true);
    }

    exports.jumpProvider = new XmlViewJumpToDefProvider();
});
