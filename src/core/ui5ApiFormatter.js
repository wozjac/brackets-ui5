define((require, exports) => {
    "use strict";

    const codeEditor = require("src/editor/codeEditor"),
        constants = require("src/core/constants");

    function getFormattedObjectApi(ui5ObjectApi, cleanHtml = false, inheritedAsArray = false) {
        const api = {
            name: ui5ObjectApi.name,
            extends: ui5ObjectApi.extends,
            apiDocUrl: ui5ObjectApi.apiDocUrl,
            isDeprecated: false,
            hasMethods: false,
            hasEvents: false,
            hasConstructor: false,
            hasConstructorParams: false,
            hasProperties: false,
            hasInheritedMethods: false,
            hasBaseObject: false,
            hasAggregations: false
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

            api.methods = JSON.parse(JSON.stringify(api.methods));

            api.methods.forEach((method) => {
                method.description = codeEditor.formatJsDoc(method.description, cleanHtml);

                if (method.deprecated) {
                    method.description = `[DEPRECATED! ${codeEditor.formatJsDoc(method.deprecated.text, true)}]  ${method.description}`;
                }

                if (method.static) {
                    method.name = `${ui5ObjectApi.name}.${method.name}`;
                }

                if (method.parameters) {
                    prepareParameters(method, cleanHtml);
                }

                method.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/methods/${method.name}`;
            });
        }

        if (ui5ObjectApi.events) {
            api.hasEvents = true;

            api.events = ui5ObjectApi.events.filter((element) => {
                return element.visibility === "public";
            });

            api.events = JSON.parse(JSON.stringify(api.events));

            api.events.forEach((event) => {
                event.description = codeEditor.formatJsDoc(event.description, cleanHtml);

                if (event.deprecated) {
                    event.description = `[DEPRECATED! ${codeEditor.formatJsDoc(event.deprecated.text, true)}]  ${event.description}`;
                }

                if (event.parameters) {
                    prepareParameters(event, cleanHtml);
                }

                event.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/events/${event.name}`;
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

                if (ui5ObjectApi.hasOwnProperty("constructor")) {
                    api.hasConstructor = true;
                    api.constructor = JSON.parse(JSON.stringify(ui5ObjectApi.constructor));
                    api.constructor.description = codeEditor.formatJsDoc(api.constructor.description, cleanHtml);

                    if (ui5ObjectApi.constructor.parameters) {
                        api.hasConstructorParams = true;
                        api.constructorParams = JSON.parse(JSON.stringify(ui5ObjectApi.constructor.parameters));

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
            api.properties = JSON.parse(JSON.stringify(properties));

            api.properties.forEach((property) => {
                if (!property.type
                    || property.type === "undefined") {

                    property.type = "";
                }

                property.description = codeEditor.formatJsDoc(property.description, cleanHtml);

                if (property.deprecated) {
                    property.description = `[DEPRECATED! ${codeEditor.formatJsDoc(property.deprecated.text, true)}]  ${property.description}`;
                }

                property.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/controlProperties`;
            });
        }

        if (ui5ObjectApi.deprecated) {
            api.isDeprecated = true;
        }

        if (ui5ObjectApi["ui5-metadata"] && ui5ObjectApi["ui5-metadata"].aggregations) {
            api.hasAggregations = true;

            api.aggregations = ui5ObjectApi["ui5-metadata"].aggregations.filter((element) => {
                return element.visibility === "public";
            });

            api.aggregations = JSON.parse(JSON.stringify(api.aggregations));

            api.aggregations.forEach((aggregation) => {
                aggregation.description = codeEditor.formatJsDoc(aggregation.description, cleanHtml);
                aggregation.apiDocUrl = `${ui5ObjectApi.apiDocUrl}/aggregations`;
            });
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

        if (inheritedAsArray === true) {
            const inheritedApiAsArray = [];
            let inheritedObject;

            for (const objectName in api.inheritedApi) {
                inheritedObject = api.inheritedApi[objectName];
                inheritedApiAsArray.push(inheritedObject);
            }

            api.inheritedApi = inheritedApiAsArray;
        }

        return api;
    }

    function prepareParameters(object, cleanHtml) {
        object.parameters.forEach((parameter) => {
            parameter.description = codeEditor.formatJsDoc(parameter.description, cleanHtml);

            if (parameter.parameterProperties) {
                const paramProperties = [];

                for (const p in parameter.parameterProperties) {
                    const param = parameter.parameterProperties[p];
                    param.name = p;
                    param.description = codeEditor.formatJsDoc(param.description, cleanHtml);
                    paramProperties.push(param);
                }

                parameter.parameterProperties = paramProperties;
            }
        });
    }

    function filterApiMembers(ui5ObjectApi, memberSearchString, memberGroupFilter) {
        const objectApi = JSON.parse(JSON.stringify(ui5ObjectApi));

        function filterMembers(key1, key2) {
            let filterable;

            if (key2) {
                filterable = objectApi[key1][key2];
            } else {
                filterable = objectApi[key1];
            }

            if (filterable) {
                return filterable.filter((member) => {
                    if (member.visibility !== "public") {
                        return false;
                    }

                    return new RegExp(memberSearchString, "i").test(member.name);
                });
            }
        }

        const filterableKeys = ["methods", "events", "properties", "aggregations"];

        if (memberSearchString) {
            for (const key of filterableKeys) {
                if (objectApi.kind === "class"
                    && (key === "properties" || key === "aggregations")) {

                    objectApi["ui5-metadata"][key] = filterMembers("ui5-metadata", key);

                    if (!objectApi["ui5-metadata"][key]
                        || (objectApi["ui5-metadata"][key]
                            && objectApi["ui5-metadata"][key].length === 0)) {

                        delete objectApi["ui5-metadata"][key];
                    }
                } else {
                    objectApi[key] = filterMembers(key);

                    if (!objectApi[key]
                        || (objectApi[key] && objectApi[key].length === 0)) {

                        delete objectApi[key];
                    }
                }
            }

            delete objectApi.constructor;
        }

        if (memberGroupFilter) {
            const deleteMarkers = {
                properties: true,
                methods: true,
                events: true,
                aggregations: true,
                construct: true
            };

            switch (memberGroupFilter) {
                case constants.memberGroupFilter.aggregations:
                    deleteMarkers.aggregations = false;
                    break;
                case constants.memberGroupFilter.methods:
                    deleteMarkers.methods = false;
                    break;
                case constants.memberGroupFilter.properties:
                    deleteMarkers.properties = false;
                    break;
                case constants.memberGroupFilter.events:
                    deleteMarkers.events = false;
                    break;
                case constants.memberGroupFilter.construct:
                    deleteMarkers.construct = false;
                    break;
            }

            _deleteMembers(objectApi, deleteMarkers);
        }

        if (objectApi.inheritedApi) {
            for (const name in objectApi.inheritedApi) {
                objectApi.inheritedApi[name] = filterApiMembers(objectApi.inheritedApi[name], memberSearchString, memberGroupFilter);
            }
        }

        return objectApi;
    }

    function _deleteMembers(objectApi, deleteMarkers) {
        if (deleteMarkers.properties === true) {
            if (objectApi.kind === "class") {
                delete objectApi["ui5-metadata"].properties;
            } else {
                delete objectApi.properties;
            }
        }

        if (deleteMarkers.aggregations === true) {
            if (objectApi.kind === "class") {
                delete objectApi["ui5-metadata"].aggregations;
            } else {
                delete objectApi.aggregations;
            }
        }

        if (deleteMarkers.events === true) {
            delete objectApi.events;
        }

        if (deleteMarkers.methods === true) {
            delete objectApi.methods;
        }

        if (deleteMarkers.construct === true) {
            delete objectApi.constructor;
        }
    }

    exports.getFormattedObjectApi = getFormattedObjectApi;
    exports.filterApiMembers = filterApiMembers;
});
