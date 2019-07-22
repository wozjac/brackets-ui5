define((require, exports) => {
    "use strict";

    const constants = require("src/core/constants"),
        xmlParser = require("src/3rdparty/xmlParser"),
        jsTool = require("src/code/jsTool");

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

    function getControllerName(xml, fullName = false) {
        const match = xml.match(/controllerName=['"]{1}([\w.]+)['"]{1}/);

        if (match) {
            if (fullName) {
                return match[1];
            } else {
                const parts = match[1].split(".");
                return parts[parts.length - 1];
            }
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
    }

    function findElementById(id, xml) {
        let result;

        const parsedXml = xmlParser.fromXML(xml);
        const namespaces = extractXmlNamespaces(xml);

        if (!parsedXml) {
            return;
        }

        jsTool.deepforEach(parsedXml, (value, key, subject, path) => {
            if (value["@id"] && value["@id"] === id) {
                let namespace;

                result = {};
                const name = path.replace(/\[.\]/g, "");
                result.element = name.substring(name.lastIndexOf(".") + 1);

                if (result.element.indexOf(":") !== -1) {
                    [namespace, result.element] = result.element.split(":");
                    namespace = namespaces[namespace];
                } else {
                    namespace = namespaces.root;
                }

                result.namespace = namespace;
            }
        });

        return result;
    }

    exports.extractXmlNamespaces = extractXmlNamespaces;
    exports.getControllerName = getControllerName;
    exports.getFunctionNameFromXmlViewElement = getFunctionNameFromXmlViewElement;
    exports.findElementById = findElementById;
});
