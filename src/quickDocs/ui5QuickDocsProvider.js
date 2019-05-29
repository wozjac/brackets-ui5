define((require, exports) => {
    "use strict";

    const InlineDocsViewer = require("./inlineDocsViewer"),
        Ui5CodeAnalyzer = require("src/code/Ui5CodeAnalyzer"),
        codeEditor = require("src/editor/codeEditor"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        ui5ApiService = require("src/core/ui5ApiService");

    function inlineProvider(hostEditor, position) {
        if (hostEditor.getLanguageForSelection().getId() !== "javascript") {
            return null;
        }

        // no multiline selection
        const selection = hostEditor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        const token = codeEditor.getToken(position, hostEditor);

        if (!token.string) {
            return null;
        }

        const result = new $.Deferred();
        const codeAnalyzer = new Ui5CodeAnalyzer(hostEditor.document.getText());

        const tokenPosition = {
            line: position.line,
            ch: token.start,
            chEnd: token.end
        };

        codeAnalyzer.resolveUi5Token(token.string, tokenPosition, true).then((ui5Objects) => {
            if (ui5Objects.length === 0) {
                result.reject();
                return;
            }
            //get the API and process - transform to Mustache's template values
            const ui5ObjectApi = ui5ApiService.getUi5ObjectDesignApi(ui5Objects[0].name);
            const templateObjects = [];
            const templateObject = ui5ApiFormatter.getFormattedObjectApi(ui5ObjectApi, false, true);
            templateObjects.push(templateObject);

            const inlineWidget = new InlineDocsViewer(templateObjects);
            inlineWidget.setDescriptionsVisibility();
            inlineWidget.load(hostEditor);
            result.resolve(inlineWidget);
            return;
        }, (error) => {
            result.reject(error);
            return;
        });

        return result.promise();
    }

    exports.inlineProvider = inlineProvider;
});
