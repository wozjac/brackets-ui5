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
        const hasSlashes = token.indexOf("/") !== -1;

        if (hasSlashes) {
            token = token.replace(/\//g, ".");
        }

        if (ui5ApiFinder.findUi5ObjectByName(token)) {
            return true;
        }

        return false;
    }

    function deepforEach(value, fn, path) {
        path = path || "";
        if (Array.isArray(value)) {
            _forEachArray(value, fn, path);
        } else if (_isObject(value)) {
            _forEachObject(value, fn, path);
        }
    }

    function _forEachObject(obj, fn, path) {
        for (const key in obj) {
            const deepPath = path ? `${path}.${key}` : key;
            fn.call(obj, obj[key], key, obj, deepPath);
            deepforEach(obj[key], fn, deepPath);
        }
    }

    function _forEachArray(array, fn, path) {
        array.forEach((value, index, arr) => {
            const deepPath = `${path}[${index}]`;
            fn.call(arr, value, index, arr, deepPath);
            deepforEach(arr[index], fn, deepPath);
        });
    }

    function _isObject(obj) {
        const type = typeof obj;
        return type === "function" || type === "object" && !!obj;
    }

    exports.extractDefineObjects = extractDefineObjects;
    exports.isFullUi5Path = isFullUi5Path;
    exports.getUi5ObjectFromDefineStatement = getUi5ObjectFromDefineStatement;
    exports.deepforEach = deepforEach;
});
