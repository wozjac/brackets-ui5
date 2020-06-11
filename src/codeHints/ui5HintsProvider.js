define((require, exports, module) => {
    "use strict";

    const XmlViewTagsHints = require("src/codeHints/XmlViewTagsHints"),
        XmlViewAtrributesHints = require("src/codeHints/XmlViewAttributesHints"),
        Ui5CodeHints = require("src/codeHints/Ui5CodeHints"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        ui5ApiService = require("src/core/ui5ApiService"),
        strings = require("strings"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        ternDomain = new NodeDomain("BracketsUi5Tern", ExtensionUtils.getModulePath(module, "../../node/ternDomain"));

    exports.getXmlViewTagsHintsProvider = () => {
        return new XmlViewTagsHints();
    };

    exports.getXmlViewAttributesHintsProvider = () => {
        return new XmlViewAtrributesHints();
    };

    exports.getUi5CodeHintsProvider = () => {
        return new Ui5CodeHints();
    };

    exports.initTernServer = () => {
        return new Promise((resolve, reject) => {
            ternDomain.exec("invokeTernCommand", {
                    commandType: "TernInit",
                    options: {
                        definitions: ui5ApiService.sapLibraryDefinitions,
                        requireJsDefinitions: ui5ApiService.requirejsOverrides
                    }
                })
                .done(() => {
                    resolve();
                })
                .fail((error) => {
                    console.error(strings.TERN_SERVER_INIT_FAILED);
                    reject(error);
                });
        });
    };
});
