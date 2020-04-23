"use strict";

define((require, exports) => {
    const JSUtils = brackets.getModule("language/JSUtils"),
        ui5Files = require("src/ui5Project/ui5Files");

    function findFunctionInFiles(functionName, fileRegex) {
        return new Promise((resolve, reject) => {
            ui5Files.findFiles(fileRegex)
                .then((files) => {
                    if (files && files.length > 0) {
                        return JSUtils.findMatchingFunctions(functionName, files);
                    } else {
                        reject("NOT_FOUND");
                    }
                })
                .then((matchedFunctions) => {
                    if (matchedFunctions && matchedFunctions.length === 1) {
                        resolve(matchedFunctions[0]);
                    } else {
                        reject("NOT_FOUND");
                    }
                })
                .catch(() => {
                    reject("ERROR");
                });
        });
    }

    function findFunctionInController(functionName, controllerName) {
        return new Promise((resolve, reject) => {
            if (!controllerName) {
                reject("NOT_FOUND");
            }

            ui5Files.getControllerFile(controllerName)
                .then((fileInfo) => {
                    return JSUtils.findMatchingFunctions(functionName, [fileInfo.file]);
                })
                .then((matchedFunctions) => {
                    if (matchedFunctions && matchedFunctions.length === 1) {
                        resolve(matchedFunctions[0]);
                    } else {
                        reject("NOT_FOUND");
                    }
                })
                .catch(() => {
                    reject("ERROR");
                });
        });
    }

    exports.findFunctionInFiles = findFunctionInFiles;
    exports.findFunctionInController = findFunctionInController;
});
