define((require, exports, module) => {
    "use strict";

    const strings = require("strings"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        ternDomain = new NodeDomain("BracketsUi5Tern", ExtensionUtils.getModulePath(module, "../../node/ternDomain"));

    const ternFiles = [];

    function addFileToTern(document) {
        return new Promise((resolve, reject) => {
            if (ternFiles.includes(document.file.fullPath)) {
                ternDomain.exec("invokeTernCommand", {
                        commandType: "TernUpdateFile",
                        options: {
                            filename: document.file.fullPath,
                            text: document.getText().replace("sap.ui.define", "require")
                        }
                    })
                    .done(() => {
                        resolve();
                    })
                    .fail((error) => {
                        console.error(strings.TERN_SERVER_INIT_FAILED);
                        reject(error);
                    });
            } else {
                ternDomain.exec("invokeTernCommand", {
                        commandType: "TernAddFiles",
                        options: {
                            files: [{
                                name: document.file.fullPath,
                                text: document.getText().replace("sap.ui.define", "require")
                                }]
                        }
                    })
                    .done(() => {
                        resolve();
                        ternFiles.push(document.file.fullPath);
                    })
                    .fail((error) => {
                        console.error(strings.TERN_SERVER_INIT_FAILED);
                        reject(error);
                    });
            }
        });
    }

    function getTernHints(options) {
        return new Promise((resolve, reject) => {
            ternDomain.off("ternCompletionsEvent");

            ternDomain.on("ternCompletionsEvent", (event, data) => {
                resolve(data);
            });

            ternDomain.exec("invokeTernCommand", {
                    commandType: "TernCompletions",
                    options
                })
                .fail((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    function getUi5Type(options) {
        return new Promise((resolve, reject) => {
            //            setTimeout(() => {
            //                if (!resolved) {
            //                    resolve();
            //                }
            //            }, 1500);

            ternDomain.off("ternTypeEvent");

            ternDomain.on("ternTypeEvent", (event, data) => {
                resolve(data);
            });

            ternDomain.exec("invokeTernCommand", {
                    commandType: "TernType",
                    options
                })
                .fail((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    exports.addFileToTern = addFileToTern;
    exports.getTernHints = getTernHints;
    exports.getUi5Type = getUi5Type;
});
