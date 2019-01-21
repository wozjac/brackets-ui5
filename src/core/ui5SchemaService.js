define((require, exports) => {
    "use strict";

    const Ui5XmlProcessor = require("src/core/Ui5XmlProcessor"),
        preferences = require("src/main/preferences"),
        strings = require("strings"),
        constants = require("src/core/constants");

    const libNamespaces = [],
        xsdNotFound = [],
        loadedNamespaces = {};

    let subNamespacedObjects = {};

    function fetchSchema(namespace) {
        const url = `${preferences.get(constants.prefs.API_URL)}/downloads/schemas/${namespace}.xsd`;
        return $.ajax(url);
    }

    function prepareSchema(namespace) {
        return new Promise((resolve) => {
            fetchSchema(namespace).done((schemaXml) => {
                const ui5XmlProcessor = new Ui5XmlProcessor(schemaXml);
                const objects = ui5XmlProcessor.getObjects();
                loadedNamespaces[namespace] = objects;
                subNamespacedObjects = Object.assign(ui5XmlProcessor.getSubNamespacedObjects(), subNamespacedObjects);
                console.log(`${strings.XML_SCHEMA_READY} ${namespace}`);
                resolve();
            }).fail(() => {
                //console.log(`${strings.URL_XML_GET_ERROR}: ${error}`);
                //reject(error);
                xsdNotFound.push(namespace);
                resolve();
            });
        });
    }

    function adjustNamespaces() {
        let subNamespace, movedObject, subObject, objectName;

        for (const subObjectName in subNamespacedObjects) {
            subObject = subNamespacedObjects[subObjectName];
            objectName = subObjectName.substring(subObjectName.lastIndexOf(".") + 1);
            movedObject = loadedNamespaces[subObject.targetNamespace][objectName];

            if (movedObject) {
                subNamespace = loadedNamespaces[`${subObject.targetNamespace}.${subObject.subNamespace}`];

                if (!subNamespace) {
                    loadedNamespaces[`${subObject.targetNamespace}.${subObject.subNamespace}`] = {};
                }

                loadedNamespaces[`${subObject.targetNamespace}.${subObject.subNamespace}`][objectName] = movedObject;
                delete loadedNamespaces[subObject.targetNamespace][objectName];
            }
        }
    }

    function getParentsAttributes(object, parent) {
        let parentObject, parentNamespace, lastDot, parentAttributes, candidate, present, found;

        while (parent) {
            lastDot = parent.lastIndexOf(".");
            parentNamespace = parent.substr(0, lastDot);

            if (parentNamespace) {
                parentObject = parent.substr(lastDot + 1);
                //parentAttributes = object.attributes.concat(loadedNamespaces[parentNamespace][parentObject].attributes);
                parentAttributes = loadedNamespaces[parentNamespace][parentObject].attributes;

                for (const index in parentAttributes) {
                    candidate = parentAttributes[index];

                    for (const index2 in object.attributes) {
                        present = object.attributes[index2];

                        if (present.name === candidate.name) {
                            found = true;
                        }
                    }

                    if (!found) {
                        object.attributes.push(candidate);
                    }

                    found = false;
                }
            }

            parent = loadedNamespaces[parentNamespace][parentObject].extendsElement;
        }
    }

    function fillInheritedAttributes() {
        for (const namespace in loadedNamespaces) {
            for (let object in loadedNamespaces[namespace]) {
                object = loadedNamespaces[namespace][object];

                if (object.extendsElement) {
                    getParentsAttributes(object, object.extendsElement);
                }
            }
        }
    }

    function fetchLibraries() {
        const url = `${preferences.get(constants.prefs.API_URL)}/discovery/all_libs`;
        return $.ajax(url);
    }

    function initSchemas() {
        const promises = [];

        fetchLibraries().done((librariesJson) => {
            if (typeof librariesJson === "string") {
                librariesJson = JSON.parse(librariesJson);
            }

            librariesJson.all_libs.forEach((lib) => {
                libNamespaces.push(lib.entry.replace(/\//g, "."));
            });

            for (const schema of libNamespaces) {
                promises.push(prepareSchema(schema));
            }

            Promise.all(promises).then(() => {
                fillInheritedAttributes();
                adjustNamespaces();

                if (xsdNotFound.length > 0) {
                    console.log(`${strings.URL_XML_GET_ERROR}: ${xsdNotFound}`);
                }
            });
        });
    }

    exports.tags = loadedNamespaces;
    exports.initSchemas = initSchemas;
});
