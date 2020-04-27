define((require, exports) => {
    "use strict";

    const MultiRangeInlineEditor = brackets.getModule("editor/MultiRangeInlineEditor").MultiRangeInlineEditor,
        xmlExtract = require("src/code/xmlExtract"),
        ui5CodeSearch = require("src/code/ui5CodeSearch"),
        strings = require("strings"),
        constants = require("src/core/constants");

    function inlineEditProvider(hostEditor) {
        if (hostEditor.getModeForSelection() !== "xml") {
            return null;
        }

        const selection = hostEditor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        let functionName = _getFunctionName(hostEditor, selection.start);
        functionName = functionName.split(".").pop();
        const controllerName = _getControllerName(hostEditor);

        if (!functionName) {
            return null;
        }

        return _handleQuickEdit(functionName, controllerName, hostEditor);
    }

    function _handleQuickEdit(functionName, controllerName, hostEditor) {
        const result = new $.Deferred();

        ui5CodeSearch.findFunctionInController(functionName, controllerName)
            .then((matchingFunctionInfo) => {
                const inlineEditor = new MultiRangeInlineEditor([matchingFunctionInfo]);
                inlineEditor.load(hostEditor);
                result.resolve(inlineEditor);
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
                        result.reject(error);
                }
            })
            .then((matchingFunctionInfo) => {
                const inlineEditor = new MultiRangeInlineEditor([matchingFunctionInfo]);
                inlineEditor.load(hostEditor);
                result.resolve(inlineEditor);
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
                const inlineEditor = new MultiRangeInlineEditor([matchingFunctionInfo]);
                inlineEditor.load(hostEditor);
                result.resolve(inlineEditor);
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

    function _getFunctionName(hostEditor, position) {
        const token = hostEditor._codeMirror.getTokenAt(position, false);

        return xmlExtract.getFunctionNameFromXmlViewElement(token.string);
    }

    function _getControllerName(hostEditor) {
        return xmlExtract.getControllerName(hostEditor.document.getText());
    }

    exports._getFunctionName = _getFunctionName;
    exports.inlineEditProvider = inlineEditProvider;
});
