define((require, exports) => {
    "use strict";

    const ui5ApiFinder = require("src/core/ui5ApiFinder"),
        astTool = require("src/code/astTool");

    function extractDefineObjects(arrayString) {
        if (arrayString) {
            arrayString = arrayString.replace(/['"\s]*/g, "");
            return arrayString.split(",");
        } else {
            return null;
        }
    }

    function getUi5ObjectFromDefineStatement(token, ast) {
        let ui5Object;

        //const ast = astTool.parse(sourceCode, {
        //    removeComments: true
        //});

        const defineObjects = astTool.getDefineStatementObjects(ast);

        if (defineObjects) {
            let ui5Path = defineObjects[token];

            if (ui5Path) {
                ui5Path = ui5Path.replace(new RegExp("/", "g"), ".");
                ui5Object = ui5ApiFinder.findUi5ObjectByName(ui5Path);
            }
        }

        return ui5Object;
    }

    function isFullUi5Path(token) {
        //if we have dots or / we can assume it's full object name
        const hasSlashes = token.indexOf("/") !== -1;
        if (token.indexOf(".") !== -1 || hasSlashes) {
            if (hasSlashes) {
                token = token.replace(/\//g, ".");
            }

            if (ui5ApiFinder.findUi5ObjectByName(token)) {
                return true;
            }
        }

        return false;
    }

    exports.extractDefineObjects = extractDefineObjects;
    exports.isFullUi5Path = isFullUi5Path;
    exports.getUi5ObjectFromDefineStatement = getUi5ObjectFromDefineStatement;
});
