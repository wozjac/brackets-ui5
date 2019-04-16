define((require, exports) => {
    "use strict";

    const constants = require("src/core/constants");

    function extractXmlNamespaces(xml) {
        const namespaces = {};

        let match, prefix;

        do {
            match = constants.regex.xmlNamespace.exec(xml);
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

    function getControllerName(xml) {
        const match = xml.match(/controllerName=['"]{1}([\w.]+)['"]{1}/);

        if (match) {
            const parts = match[1].split(".");
            return parts[parts.length - 1];
        }

        return null;
    }

    exports.extractXmlNamespaces = extractXmlNamespaces;
    exports.getControllerName = getControllerName;
});
