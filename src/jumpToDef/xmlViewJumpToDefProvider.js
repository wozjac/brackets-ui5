define((require, exports) => {

    const JSUtils = brackets.getModule("language/JSUtils"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        codeEditor = require("src/editor/codeEditor"),
        i18nTool = require("src/code/i18nTool"),
        xmlExtract = require("src/code/xmlExtract"),
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
                const functionName = xmlExtract.getFunctionNameFromXmlViewElement(token.string);
                const controllerName = xmlExtract.getControllerName(this.editor.document.getText());

                if (!functionName) {
                    if (!controllerName) {
                        return null;
                    } else {
                        return _handleControllerJump(controllerName);
                    }
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

                result.resolve(true);
            })
            .catch((error) => {
                console.log(error);
                result.reject(error);
            });

        return result.promise();
    }

    function _handleFunctionJump(functionName, controllerName) {
        const result = new $.Deferred();
        let controllerFileInfo, rangeInfo, matchingFunctions;

        ui5Files.getControllerFile(controllerName)
            .then((fileInfo) => {
                controllerFileInfo = fileInfo;
                return JSUtils.findMatchingFunctions(functionName, [fileInfo.file]);
            })
            .then((resultArray) => {
                matchingFunctions = resultArray;
                if (matchingFunctions && matchingFunctions.length > 0) {
                    rangeInfo = {
                        document: matchingFunctions[0].document,
                        name: functionName,
                        lineStart: matchingFunctions[0].lineStart,
                        lineEnd: matchingFunctions[0].lineEnd
                    };

                    return ui5Files.openFile(controllerFileInfo.file.fullPath);
                } else {
                    return _handleControllerJump(controllerName);
                }
            })
            .then(() => {
                const newEditor = EditorManager.getActiveEditor();
                const cursorEndPosition = matchingFunctions[0].document.getLine(rangeInfo.lineStart).length;
                newEditor.setCursorPos(rangeInfo.lineStart, cursorEndPosition, true);
                result.resolve(true);
            })
            .catch(() => {
                result.reject();
            });

        return result.promise();
    }

    function _handleControllerJump(controllerName) {
        const result = new $.Deferred();

        ui5Files.getControllerFile(controllerName)
            .then((fileInfo) => {
                return ui5Files.openFile(fileInfo.file.fullPath);
            })
            .then(() => {
                const newEditor = EditorManager.getActiveEditor();
                newEditor.setCursorPos(0, 0, true);
                result.resolve(true);
            })
            .catch(() => {
                result.reject();
            });

        return result.promise();
    }

    exports.jumpProvider = new XmlViewJumpToDefProvider();
});
