define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService");

    function findUi5ApiObjects(query) {
        let result = ui5ApiService.getUi5Objects().filter((apiObject) => {
            if (query.ignoreCase === undefined) {
                query.ignoreCase = true;
            }

            let regex;

            if (query.ignoreCase) {
                regex = new RegExp(query.path, "i");
            } else {
                regex = new RegExp(query.path);
            }

            return apiObject.path.search(regex) !== -1;
        });

        //full path?
        if (result.length > 0 && query.path !== "sap") {
            const object = result.find((apiObject) => {
                return apiObject.path === query.path;
            });

            if (object) {
                result = [object];
            }
        }

        return result.length > 0 ? result : null;
    }

    function findUi5ObjectByPath(searchedPath, ignoreCase = true) {
        return ui5ApiService.getUi5Objects().find((element) => {
            if (ignoreCase) {
                return element.path.toLowerCase() === searchedPath.toLowerCase();
            } else {
                return element.path === searchedPath;
            }
        });
    }

    function findUi5ObjectByName(searchedName, ignoreCase = true) {
        const result = ui5ApiService.getUi5Objects().filter((object) => {
            const name = object.name.substr(object.name.lastIndexOf(".") + 1);
            if (ignoreCase) {
                return name.toLowerCase() === searchedName.toLowerCase();
            } else {
                return name === searchedName;
            }

        });

        return result.length > 0 ? result : null;
    }

    function findUi5Library(namespace, ignoreCase = true) {
        let result = ui5ApiService.getUi5ApiIndex().symbols.find((element) => {
            if (ignoreCase) {
                return element.name.toLowerCase() === namespace.toLowerCase();
            } else {
                return element.name === namespace;
            }
        });

        if (result) {
            result = result.lib.replace(/\./g, "/");
        }

        return result;
    }

    exports.findUi5ApiObjects = findUi5ApiObjects;
    exports.findUi5ObjectByPath = findUi5ObjectByPath;
    exports.findUi5ObjectByName = findUi5ObjectByName;
    exports.findUi5Library = findUi5Library;
});
