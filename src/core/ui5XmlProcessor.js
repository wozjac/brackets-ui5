"use strict";

define((require, exports) => {
    const xmlParser = require("src/3rdparty/xmlParser");

    let complexTypes, elements, namespaces;

    function formatDocumentation(documentation) {
        documentation = documentation
            .replace(/{@\w+/g, "")
            .replace(/}/g, "")
            .replace(/#\w+/g, "")
            .replace(/\s\s+/g, " ")
            .replace(/<[^>]+>/ig, "");

        return documentation;
    }

    function prepareAttribute(attributeObject) {
        const attribute = {
            name: attributeObject["@name"]
        };

        try {
            let doc = attributeObject["xsd:annotation"]["xsd:documentation"];
            doc = formatDocumentation(doc);
            attribute.documentation = doc;
        } catch (error) {
            attribute.documentation = "";
        }

        return attribute;
    }

    function extractComplexTypes(data) {
        const result = {};
        let attributes = [];
        const complexTypes = data["xsd:schema"]["xsd:complexType"];

        if (!complexTypes) {
            return null;
        }

        for (const complex of data["xsd:schema"]["xsd:complexType"]) {
            let content = complex["xsd:complexContent"];

            if (!content) {
                content = complex["xsd:simpleContent"];
            }

            if (!content) {
                continue;
            }

            attributes = content["xsd:extension"]["xsd:attribute"];

            if (attributes) {
                if (attributes instanceof Array) {
                    attributes = attributes.map(prepareAttribute);
                } else {
                    attributes = [prepareAttribute(attributes)];
                }
            }

            result[complex["@name"].replace("_", "")] = {
                attributes
            };
        }

        return result;
    }

    function extractElements(data) {
        const result = [];
        let type, restrictions, extendsElement, documentation;

        for (const element of data["xsd:schema"]["xsd:element"]) {
            try {
                type = element["@type"].split(":")[1].replace("_", "");
            } catch (error) {
                type = "";
            }

            try {
                documentation = element["xsd:annotation"]["xsd:documentation"];
                documentation = formatDocumentation(documentation);
            } catch (error) {
                documentation = "";
            }

            try {
                restrictions = element["xsd:complexType"]["xsd:simpleContent"]["xsd:restriction"];
                restrictions = restrictions.map((restriction) => {
                    return restriction["@base"].split(":")[1].replace("_", "");
                });
            } catch (err) {
                restrictions = [];
            }

            try {
                let namespace = element["@substitutionGroup"].split(":")[0];
                if (namespace) {
                    namespace = namespaces[namespace];
                    extendsElement = `${namespace}.${element["@substitutionGroup"].split(":")[1]}`;
                } else {
                    throw new Error("No namespace");
                }
            } catch (err) {
                extendsElement = "";
            }

            result.push({
                name: element["@name"],
                type,
                restrictions,
                extendsElement,
                documentation
            });
        }

        return result;
    }

    function extractNamespaces(jsonXmlData) {
        const namespaces = {};
        const root = jsonXmlData["xsd:schema"];

        for (const key in root) {
            if (key.indexOf("xmlns") !== -1) {
                namespaces[key.split(":")[1]] = root[key];
            }
        }

        return namespaces;
    }

    function prepareTags() {
        const result = {};
        let attributes;

        for (const element of elements) {
            attributes = [];

            if (complexTypes[element.type] && complexTypes[element.type].attributes) {
                attributes = complexTypes[element.type].attributes;
            }

            if (element.restrictions && element.restrictions.length > 0) {
                for (const restriction of element.restrictions) {
                    attributes = attributes.concat(complexTypes[restriction].attributes);
                }
            }

            result[element.name] = {
                attributes,
                extendsElement: element.extendsElement,
                documentation: element.documentation
            };
        }

        return result;
    }

    function extractTags(jsonXmlData) {
        complexTypes = extractComplexTypes(jsonXmlData);
        namespaces = extractNamespaces(jsonXmlData);

        if (complexTypes) {
            elements = extractElements(jsonXmlData);
            return prepareTags();
        }

        return null;
    }

    function parseXml(data) {
        return xmlParser.fromXML(data);
    }

    function getParentsAttributes(object, parent, tags) {
        let parentObject, parentNamespace, lastDot;

        while (parent) {
            lastDot = object.extendsElement.lastIndexOf(".");
            parentObject = parent.substr(lastDot + 1);
            parentNamespace = parent.substr(0, lastDot);

            object.attributes = object.attributes.concat(tags[parentNamespace][parentObject].attributes);

            parent = tags[parentNamespace][parentObject].extendsElement;
        }
    }

    function fillInheritedAttributes(tags) {
        for (const namespace in tags) {
            for (let object in tags[namespace]) {
                object = tags[namespace][object];

                if (object.extendsElement) {
                    getParentsAttributes(object, object.extendsElement, tags);
                }
            }
        }
    }

    function adjustFormNamespace(tags) {
        const formObjects = ["Form", "FormContainer", "FormElement", "FormLayout", "GridContainerData", "GridElementData", "GridLayout", "ResponsiveGridLayout", "ResponsiveLayout", "SimpleForm"];

        tags["sap.ui.layout.form"] = {};

        for (const objectName of formObjects) {
            tags["sap.ui.layout.form"][objectName] = tags["sap.ui.layout"][objectName];
            delete tags["sap.ui.layout"][objectName];
        }
    }

    exports.parseXml = parseXml;
    exports.extractTags = extractTags;
    exports.fillInheritedAttributes = fillInheritedAttributes;
    exports.adjustFormNamespace = adjustFormNamespace;
    exports.getParentsAttributes = getParentsAttributes;
});
