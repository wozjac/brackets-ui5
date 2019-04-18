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

    function getFunctionNameFromXmlViewElement(functionString) {
        let functionName = functionString.replace(/['"{}]/g, "").trim();
        const startBracket = functionString.indexOf("(");

        if (startBracket > 0) { //event handler with params
            functionName = functionName.substring(0, startBracket - 1);
        }

        if (functionName.startsWith(".")) {
            functionName = functionName.slice(1);
        }

        return functionName;

        //const value = functionString.replace(/['"{}.]/g, "").trim().split("(");
        //
        //return value[0];
    }

    exports.extractXmlNamespaces = extractXmlNamespaces;
    exports.getControllerName = getControllerName;
    exports.getFunctionNameFromXmlViewElement = getFunctionNameFromXmlViewElement;
});
