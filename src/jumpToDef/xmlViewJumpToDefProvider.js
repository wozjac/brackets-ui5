define((require, exports) => {

    const JSUtils = brackets.getModule("language/JSUtils"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Commands = brackets.getModule("command/Commands"),
        CommandManager = brackets.getModule("command/CommandManager"),
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

                if (!controllerName || !functionName) {
                    return null;
                }

                return _handleFunctionJump(functionName, controllerName);
            }
        }
    }

    function _handleI18nJump(i18nInfo) {
        const result = new $.Deferred();
        let i18nDocument, i18nFile;

        ui5Files.getModelInfo(i18nInfo.modelName).then((modelInfo) => {
            i18nFile = modelInfo;
            return DocumentManager.getDocumentForPath(modelInfo.path);
        }).then((document) => {
            i18nDocument = document;
            return i18nTool.getEntryRange(i18nInfo, i18nDocument);
        }).then((rangeInfo) => {
            if (rangeInfo) {
                CommandManager.execute(Commands.FILE_OPEN, {
                        fullPath: i18nFile.path
                    })
                    .done(() => {
                        const newEditor = EditorManager.getActiveEditor();
                        const cursorEndPosition = i18nDocument.getLine(rangeInfo.lineStart).length;
                        newEditor.setCursorPos(rangeInfo.lineStart, cursorEndPosition, true);
                        result.resolve(true);
                    })
                    .catch((error) => {
                        result.reject(error);
                    });
            } else {
                result.resolve(null);
            }

        }).catch((error) => {
            console.log(error);
            result.reject(error);
        });

        return result.promise();
    }

    function _handleFunctionJump(functionName, controllerName) {
        const result = new $.Deferred();
        let controllerFileInfo, rangeInfo;

        ui5Files.getControllerFile(controllerName)
            .then((fileInfo) => {
                controllerFileInfo = fileInfo;
                return JSUtils.findMatchingFunctions(functionName, [fileInfo.file]);
            })
            .then((resultArray) => {
                if (resultArray && resultArray.length > 0) {
                    rangeInfo = {
                        document: resultArray[0].document,
                        name: functionName,
                        lineStart: resultArray[0].lineStart,
                        lineEnd: resultArray[0].lineEnd
                    };

                    CommandManager.execute(Commands.FILE_OPEN, {
                            fullPath: controllerFileInfo.file.fullPath
                        })
                        .done(() => {
                            const newEditor = EditorManager.getActiveEditor();
                            const cursorEndPosition = resultArray[0].document.getLine(rangeInfo.lineStart).length;
                            newEditor.setCursorPos(rangeInfo.lineStart, cursorEndPosition, true);
                            result.resolve(true);
                        })
                        .catch(() => {
                            result.reject();
                        });
                } else {
                    result.resolve(null);
                }
            })
            .catch((error) => {
                result.reject(error);
            });

        return result.promise();
    }

    exports.jumpProvider = new XmlViewJumpToDefProvider();
});
