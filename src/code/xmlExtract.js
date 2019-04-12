define((require, exports) => {
    "use strict";

    const constants = require("src/core/constants");

    function extractXmlNamespaces(sourceXml) {
        const namespaces = {};

        let match, prefix;

        do {
            match = constants.regex.xmlNamespace.exec(sourceXml);
            if (match) {
                if (match[1]) {
                    prefix = match[1];
                } else {
                    prefix = "root";
                }

                namespaces[prefix] = match[2];
            }
        } while (match);

        return namespaces;
    }

    exports.extractXmlNamespaces = extractXmlNamespaces;
});
