define((require, exports) => {

    const JSUtils = brackets.getModule("language/JSUtils"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Commands = brackets.getModule("command/Commands"),
        CommandManager = brackets.getModule("command/CommandManager"),
        codeEditor = require("src/editor/codeEditor"),
        xmlExtract = require("src/code/xmlExtract"),
        ui5Files = require("src/ui5Project/ui5Files");

    function xmlViewJumpToDefProvider(editor, position) {
        if (editor.getModeForSelection() !== "xml") {
            return null;
        }

        // no multiline selection
        const selection = editor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        const token = codeEditor.getToken(position, editor);
        const functionName = xmlExtract.getFunctionNameFromXmlViewElement(token.string);
        const controllerName = xmlExtract.getControllerName(editor.document.getText());

        if (!controllerName || !functionName) {
            return null;
        }

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

                            newEditor.setCursorPos(rangeInfo.lineStart, 5, true);
                            result.resolve(true);
                        })
                        .catch(() => {
                            result.reject();
                        });
                } else {
                    result.reject();
                }
            })
            .catch((error) => {
                result.reject(error);
            });

        return result.promise();
    }

    exports.jumpProvider = xmlViewJumpToDefProvider;
});
