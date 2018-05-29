define((require, exports) => {
    "use strict";

    const ui5XmlProcessor = require("src/core/ui5XmlProcessor"),
        preferences = require("src/main/preferences"),
        strings = require("strings"),
        constants = require("src/core/constants");

    const openUi5Namespaces = [
        "sap.f",
        "sap.m",
        "sap.tnt",
        "sap.ui.commons",
        "sap.ui.core",
        "sap.ui.fl",
        "sap.ui.layout",
        "sap.ui.suite",
        "sap.ui.table",
        "sap.ui.unified",
        "sap.ui.ux3",
        "sap.uxap"
    ];

    let sapUi5Namespaces = [
        "sap.ca.ui",
        "sap.landvisz",
        "sap.makit",
        "sap.me",
        "sap.suite.ui.microchart",
        "sap.ui.comp",
        "sap.ui.richtexteditor",
        "sap.ui.suite",
        "sap.uiext.inbox",
        "sap.viz",
        "sap.zen.crosstab",
        "sap.zen.dsh"
    ];

    sapUi5Namespaces = sapUi5Namespaces.concat(openUi5Namespaces);

    const loadedNamespaces = {};

    function fetchSchema(namespace) {
        const url = `${preferences.get(constants.prefs.API_URL)}/downloads/schemas/${namespace}.xsd`;
        return $.ajax(url);
    }

    function prepareSchema(namespace) {
        return new Promise((resolve, reject) => {
            fetchSchema(namespace).done((schemaXml) => {
                const schemaJson = ui5XmlProcessor.parseXml(schemaXml);
                const objects = ui5XmlProcessor.extractTags(schemaJson);
                loadedNamespaces[namespace] = objects;
                console.log(`${strings.XML_SCHEMA_READY} ${namespace}`);
                resolve();
            }).fail((error) => {
                console.log(`${strings.URL_XML_GET_ERROR}: ${error}`);
                reject(error);
            });
        });
    }

    function adjustFormNamespace() {
        const formObjects = ["Form", "FormContainer", "FormElement", "FormLayout", "GridContainerData", "GridElementData", "GridLayout", "ResponsiveGridLayout", "ResponsiveLayout", "SimpleForm"];

        loadedNamespaces["sap.ui.layout.form"] = {};

        for (const objectName of formObjects) {
            loadedNamespaces["sap.ui.layout.form"][objectName] = loadedNamespaces["sap.ui.layout"][objectName];
            delete loadedNamespaces["sap.ui.layout"][objectName];
        }
    }

    function getParentsAttributes(object, parent) {
        let parentObject, parentNamespace, lastDot;

        while (parent) {
            lastDot = parent.lastIndexOf(".");
            parentNamespace = parent.substr(0, lastDot);

            if (parentNamespace) {
                parentObject = parent.substr(lastDot + 1);
                object.attributes = object.attributes.concat(loadedNamespaces[parentNamespace][parentObject].attributes);
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

    function initSchemas() {
        let schemas;

        if (preferences.get(constants.prefs.API_URL).toLowerCase().indexOf("sapui5") !== -1) {
            schemas = sapUi5Namespaces;
        } else {
            schemas = openUi5Namespaces;
        }

        const promises = [];

        for (const schema of schemas) {
            promises.push(prepareSchema(schema));
        }

        Promise.all(promises).then(() => {
            fillInheritedAttributes();
            adjustFormNamespace();
        });
    }

    exports.tags = loadedNamespaces;
    exports.initSchemas = initSchemas;
});
