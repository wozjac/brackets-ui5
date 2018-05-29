define((require, exports) => {
    "use strict";

    const XmlViewTagsHints = require("src/codeHints/XmlViewTagsHints"),
        XmlViewAtrributesHints = require("src/codeHints/XmlViewAttributesHints"),
        Ui5CodeHints = require("src/codeHints/Ui5CodeHints");

    exports.getXmlViewTagsHintsProvider = () => {
        return new XmlViewTagsHints();
    };

    exports.getXmlViewAttributesHintsProvider = () => {
        return new XmlViewAtrributesHints();
    };

    exports.getUi5CodeHintsProvider = () => {
        return new Ui5CodeHints();
    };
});
