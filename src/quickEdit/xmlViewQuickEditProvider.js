define((require, exports) => {
    "use strict";

    const MultiRangeInlineEditor = brackets.getModule("editor/MultiRangeInlineEditor").MultiRangeInlineEditor,
        JSUtils = brackets.getModule("language/JSUtils"),
        xmlExtract = require("src/code/xmlExtract"),
        ui5Files = require("src/ui5Project/ui5Files");

    function inlineEditProvider(hostEditor) {
        if (hostEditor.getModeForSelection() !== "xml") {
            return null;
        }

        const selection = hostEditor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        const functionName = _getFunctionName(hostEditor, selection.start);
        const controllerName = _getControllerName(hostEditor);

        if (!controllerName || !functionName) {
            return null;
        }

        const result = new $.Deferred();

        ui5Files.getControllerFile(controllerName)
            .then((fileInfo) => {
                return JSUtils.findMatchingFunctions(functionName, [fileInfo.file]);
            })
            .then((resultArray) => {
                if (resultArray && resultArray.length > 0) {
                    const rangeInfo = {
                        document: resultArray[0].document,
                        name: functionName,
                        lineStart: resultArray[0].lineStart,
                        lineEnd: resultArray[0].lineEnd
                    };

                    const inlineEditor = new MultiRangeInlineEditor([rangeInfo]);
                    inlineEditor.load(hostEditor);
                    result.resolve(inlineEditor);
                }
            })
            .catch((error) => {
                result.reject(error);
            });

        return result.promise();
    }

    function _getFunctionName(hostEditor, position) {
        const token = hostEditor._codeMirror.getTokenAt(position, true);
        const value = token.string.replace(/['"{}.]/g, "").trim().split("(");

        return value[0];
    }

    function _getControllerName(hostEditor) {
        return xmlExtract.getControllerName(hostEditor.document.getText());
    }

    exports._getFunctionName = _getFunctionName;
    exports.getInlineEditProvider = inlineEditProvider;
});
