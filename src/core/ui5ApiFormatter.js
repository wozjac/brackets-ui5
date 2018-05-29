define((require, exports) => {
    "use strict";

    const codeEditor = require("src/editor/codeEditor");

    function getFormattedObjectApi(ui5ObjectApi, cleanHtml = false) {
        const api = {
            name: ui5ObjectApi.name,
            hasMethods: false,
            hasEvents: false,
            apiDocUrl: ui5ObjectApi.apiDocUrl,
            hasConstructor: false,
            hasProperties: false,
            isDeprecated: false
        };

        api.description = codeEditor.formatJsDoc(ui5ObjectApi.description, cleanHtml);

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
                properties = ui5ObjectApi["ui5-metadata"].properties;

                if (ui5ObjectApi.constructor) {
                    api.hasConstructor = true;
                    api.constructorParams = ui5ObjectApi.constructor.parameters;

                    api.constructorParams.forEach((param) => {
                        param.description = codeEditor.formatJsDoc(param.description, cleanHtml);
                    });
                }

                break;
            case "enum":
            case "namespace":
                properties = ui5ObjectApi.properties;

                properties.forEach((property) => {
                    if (!property.type
                        || property.type === "undefined") {

                        property.type = "";
                    }
                });

                break;
        }

        if (properties && properties.length > 0) {
            api.hasProperties = true;
            api.properties = properties;
            api.properties.forEach((property) => {
                property.description = codeEditor.formatJsDoc(property.description, cleanHtml);
            });
        }

        if (ui5ObjectApi.deprecated) {
            api.isDeprecated = true;
        }

        return api;
    }

    exports.getFormattedObjectApi = getFormattedObjectApi;
});
