"use strict";

define((require, exports, module) => {
    const xmlParser = require("src/3rdparty/xmlParser");

    class Ui5XmlProcessor {
        constructor(xmlSchema) {
            this._xmlSchema = xmlSchema;
            this._jsonSchema = xmlParser.fromXML(xmlSchema);
            this._targetNamespace = this._jsonSchema["xsd:schema"]["@targetNamespace"];
            this._complexTypes = this._extractComplexTypes();
            this._namespaces = this._extractNamespaces();
            this._subNamespacedElements = this._extractSubNamespacedElements();

            if (this._complexTypes) {
                this._elements = this._extractElements();
                this._tags = this._prepareTags();
            }
        }

        _extractComplexTypes() {
            const result = {};
            let attributes = [];
            let complexTypes = this._jsonSchema["xsd:schema"]["xsd:complexType"];

            if (!complexTypes) {
                return null;
            }

            if (!(complexTypes instanceof Array)) {
                const t = complexTypes;
                complexTypes = [];
                complexTypes.push(t);
            }

            for (const complex of complexTypes) {
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
                        attributes = attributes.map(this._prepareAttribute.bind(this));
                    } else {
                        attributes = [this._prepareAttribute(attributes)];
                    }
                }

                result[complex["@name"].replace("_", "")] = {
                    attributes
                };
            }

            return result;
        }

        _extractNamespaces() {
            const namespaces = {};
            const root = this._jsonSchema["xsd:schema"];

            for (const key in root) {
                if (key.indexOf("xmlns") !== -1) {
                    namespaces[key.split(":")[1]] = root[key];
                }
            }

            return namespaces;
        }

        _extractElements() {
            const result = [];
            let type, restrictions, extendsElement, documentation;

            let elements = this._jsonSchema["xsd:schema"]["xsd:element"];

            if (!elements) {
                return;
            }

            if (!(elements instanceof Array)) {
                const t = elements;
                elements = [];
                elements.push(t);
            }

            for (const element of elements) {
                try {
                    type = element["@type"].split(":")[1].replace("_", "");
                } catch (error) {
                    type = "";
                }

                try {
                    documentation = element["xsd:annotation"]["xsd:documentation"];
                    documentation = this._formatDocumentation(documentation);
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
                        namespace = this._namespaces[namespace];
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

        _prepareTags() {
            const result = {};
            let attributes;

            for (const element of this._elements) {
                attributes = [];

                if (this._complexTypes[element.type] && this._complexTypes[element.type].attributes) {
                    attributes = this._complexTypes[element.type].attributes;
                }

                if (element.restrictions && element.restrictions.length > 0) {
                    for (const restriction of element.restrictions) {
                        attributes = attributes.concat(this._complexTypes[restriction].attributes);
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

        _prepareAttribute(attributeObject) {
            const attribute = {
                name: attributeObject["@name"]
            };

            try {
                let doc = attributeObject["xsd:annotation"]["xsd:documentation"];
                doc = this._formatDocumentation(doc);
                attribute.documentation = doc;
            } catch (error) {
                attribute.documentation = "";
            }

            return attribute;
        }

        _extractSubNamespacedElements() {
            const comments = this._jsonSchema["xsd:schema"]["!"];
            const result = {};

            if (comments) {
                for (const comment of comments) {
                    const match = comment.match(new RegExp(`${this._targetNamespace}.([\\w\\.]*)`));
                    if (match && match[1]) {
                        const parts = match[1].split(".");
                        if (parts.length > 1) {
                            result[parts[1]] = {
                                subNamespace: parts[0],
                                targetNamespace: this._targetNamespace
                            };
                        }
                    }
                }
            }

            return result;
        }

        _formatDocumentation(documentation) {
            documentation = documentation
                .replace(/{@\w+/g, "")
                .replace(/}/g, "")
                .replace(/#\w+/g, "")
                .replace(/\s\s+/g, " ")
                .replace(/<[^>]+>/ig, "");

            return documentation;
        }

        getObjects() {
            return this._tags;
        }

        getSubNamespacedObjects() {
            return this._subNamespacedElements;
        }
    }

    module.exports = Ui5XmlProcessor;
});
