define((require, exports) => {
    "use strict";

    const codeEditor = require("src/editor/codeEditor");

    function getFormattedObjectApi(ui5ObjectApi, cleanHtml = false) {
        const api = {
            name: ui5ObjectApi.name,
            extends: ui5ObjectApi.extends,
            hasMethods: false,
            hasEvents: false,
            apiDocUrl: ui5ObjectApi.apiDocUrl,
            hasConstructor: false,
            hasConstructorParams: false,
            hasProperties: false,
            isDeprecated: false,
            hasInheritedMethods: false,
            hasBaseObject: false
        };

        api.description = codeEditor.formatJsDoc(ui5ObjectApi.description, cleanHtml);

        if (ui5ObjectApi.extends) {
            api.hasBaseObject = true;
        }

        if (ui5ObjectApi.methods) {
            api.hasMethods = true;

            api.methods = ui5ObjectApi.methods.filter((element) => {
                return element.visibility === "public";
            });

            api.methods.forEach((method) => {
                method.description = codeEditor.formatJsDoc(method.description, cleanHtml);
            });
        }

        if (ui5ObjectApi.events) {
            api.hasEvents = true;

            api.events = ui5ObjectApi.events.filter((element) => {
                return element.visibility === "public";
            });

            api.events.forEach((event) => {
                event.description = codeEditor.formatJsDoc(event.description, cleanHtml);
            });
        }

        let properties;

        switch (ui5ObjectApi.kind) {
            case "class":
                try {
                    properties = ui5ObjectApi["ui5-metadata"].properties;
                } catch (error) {
                    properties = [];
                }

                if (ui5ObjectApi.constructor) {
                    api.hasConstructor = true;

                    if (ui5ObjectApi.constructor.parameters) {
                        api.hasConstructorParams = true;
                        api.constructorParams = ui5ObjectApi.constructor.parameters;

                        api.constructorParams.forEach((param) => {
                            param.description = codeEditor.formatJsDoc(param.description, cleanHtml);
                        });
                    }
                }

                break;
            case "enum":
            case "namespace":
                properties = ui5ObjectApi.properties;
                break;
        }

        if (properties && properties.length > 0) {
            properties = properties.filter((property) => {
                return property.visibility === "public";
            });

            api.hasProperties = true;
            api.properties = properties;

            api.properties.forEach((property) => {
                if (!property.type
                    || property.type === "undefined") {

                    property.type = "";
                }

                property.description = codeEditor.formatJsDoc(property.description, cleanHtml);
            });
        }

        if (ui5ObjectApi.deprecated) {
            api.isDeprecated = true;
        }

        if (ui5ObjectApi.inheritedApi) {
            api.inheritedApi = {};

            for (const objectKey in ui5ObjectApi.inheritedApi) {
                api.inheritedApi[objectKey] = getFormattedObjectApi(ui5ObjectApi.inheritedApi[objectKey], cleanHtml);

                if (ui5ObjectApi.inheritedApi[objectKey].methods) {
                    api.hasInheritedMethods = true;
                }
            }
        }

        return api;
    }

    exports.getFormattedObjectApi = getFormattedObjectApi;
});
