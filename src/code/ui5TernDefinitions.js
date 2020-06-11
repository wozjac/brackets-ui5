define((require, exports) => {
    "use strict";

    const jsTool = require("src/code/jsTool"),
        codeEditor = require("src/editor/codeEditor"),
        ui5ApiService = require("src/core/ui5ApiService");

    const excludedUi5TypeStrings = ["*", "Error>"];
    const excludedUi5TypeCharsRegex = /[<>]/g;

    function prepareUi5Symbol(objectRef, symbol) {
        switch (symbol.kind) {
            case "namespace":
                prepareNamespace(objectRef, symbol);
                break;
            case "class":
            case "interface":
            case "enum":
            case "typedef":
                prepareClass(objectRef, symbol);
                break;
            case "function":
                _prepareMethodDefinition(objectRef, symbol, symbol.apiDocUrl);
                break;
            default:
                console.log(symbol);
        }

        if (symbol.apiDocUrl) {
            objectRef["!url"] = symbol.apiDocUrl;
        }

        if (symbol.description) {
            objectRef["!doc"] = _prepareDocumentation(symbol);
        }
    }

    function prepareMethodsDefinitions(objectRef, symbol) {
        if (jsTool.isApiElementEmpty(symbol.methods)) {
            return;
        }

        for (const method of symbol.methods) {
            _prepareMethodDefinition(objectRef, method, symbol.apiDocUrl);
        }
    }

    function preparePropertiesDefinitions(objectRef, symbol) {
        if (jsTool.isApiElementEmpty(symbol.properties)) {
            return;
        }

        for (const property of symbol.properties) {
            const typeSpec = getType(property.type);
            const propertyDefinition = {};

            if (property.static) {
                objectRef[property.name] = propertyDefinition;
            } else {
                if (!objectRef.prototype) {
                    objectRef.prototype = {};
                }

                objectRef.prototype[property.name] = propertyDefinition;
            }

            try {
                if (typeSpec.isNamespacedSapObject || typeSpec.isObject) {
                    propertyDefinition["!type"] = `+${typeSpec.type}`;
                } else {
                    propertyDefinition["!type"] = typeSpec.type;
                }
            } catch (error) {
                propertyDefinition["!type"] = "?";
            }

            const documentation = _prepareDocumentation(property);

            if (documentation) {
                propertyDefinition["!doc"] = documentation;
            }

            if (symbol.apiDocUrl) {
                propertyDefinition["!url"] = `${symbol.apiDocUrl}/controlProperties`;
            }
        }
    }

    function prepareNamespace(objectRef, symbol) {
        preparePropertiesDefinitions(objectRef, symbol);
    }

    function prepareClass(objectRef, symbol) {
        objectRef["!type"] = "fn()";
        preparePropertiesDefinitions(objectRef, symbol);
        prepareMethodsDefinitions(objectRef, symbol);

        if (symbol.extends) {
            if (!objectRef.prototype) {
                objectRef.prototype = {};
            }

            objectRef.prototype["!proto"] = `${ui5ApiService.getNormalizedName(symbol.extends)}.prototype`;
        }
    }

    function getType(type) {
        let result = null,
            normalizedUi5ObjectName;

        if (!type) {
            return null;
        }

        if (excludedUi5TypeStrings.includes(type)) {
            return null;
        }

        if (excludedUi5TypeCharsRegex.test(type)) {
            return null;
        }

        result = {
            type: "",
            isArray: false,
            isNamespacedSapObject: false,
            isObject: false,
            isFunction: false
        };

        if (type.indexOf("[]") !== -1) {
            result.isArray = true;
            type = type.replace(/[[\]]/g, "");
        }

        if (type.indexOf(".") !== -1 || type.indexOf("/") !== -1) {
            normalizedUi5ObjectName = ui5ApiService.getNormalizedName(type);

            if (normalizedUi5ObjectName.indexOf(".") !== -1) {
                result.isNamespacedSapObject = true;
            }
        }

        switch (type.toLowerCase()) {
            case "string":
                result.type = "string";
                break;
            case "boolean":
                result.type = "bool";
                break;
            case "int":
            case "integer":
            case "float":
            case "number":
                result.type = "number";
                break;
            case "object":
            case "map":
                result.type = "{}";
                break;
            case "date":
                result.type = "date";
                break;
            case "array":
                result.type = "";
                result.isArray = true;
                break;
            case "function":
                result.type = "fn()";
                result.isFunction = true;
                break;
            case "any":
                result.type = "?";
                break;
            default:
                if (type !== "undefined" && type !== "null") {
                    if (result.isNamespacedSapObject) {
                        result.type = normalizedUi5ObjectName;
                    } else {
                        result.isObject = true;
                        result.type = type;
                    }

                } else {
                    result = null;
                }
        }

        if (result) {
            if (result.isArray) {
                result.type = `[${result.type}]`;
            }
        }

        return result;
    }

    function getFunctionReturnType(returnSpec) {
        if (!returnSpec || !returnSpec.type) {
            return "";
        }

        let result = "",
            typeSpec;

        if (returnSpec.type.indexOf("|") !== -1) {
            const parts = returnSpec.type.split("|");

            for (const [index, element] of parts.entries()) {
                if (index > 0 && result) {
                    result += "|";
                }

                typeSpec = getType(element);

                if (typeSpec !== null) {
                    result += typeSpec.type;
                }
            }
        } else {
            typeSpec = getType(returnSpec.type);
        }

        if (typeSpec) {
            if (typeSpec.isObject || typeSpec.isNamespacedSapObject) {
                result = ` -> +${typeSpec.type}`;
            } else {
                result = ` -> ${typeSpec.type}`;
            }
        } else {
            result = "";
        }

        return result;
    }

    function _prepareDocumentation(apiObject) {
        if (!apiObject || !apiObject.description) {
            return null;
        }

        let docString = codeEditor.formatJsDoc(apiObject.description, true);

        if (docString.length > 130) {
            docString = `${docString.substring(0, 130)}...`;
        }

        return docString;
    }

    function _prepareMethodDefinition(objectRef, method, apiDocUrlBase) {
        const returnType = getFunctionReturnType(method.returnValue);

        let parameters;

        if (method.parameters) {
            parameters = _prepareParameters(method.parameters);
        }

        const methodDefinition = {};

        if (!objectRef.prototype) {
            objectRef.prototype = {};
        }

        if (method.static === true) {
            objectRef[method.name] = methodDefinition;
        } else {
            objectRef.prototype[method.name] = methodDefinition;
        }

        let functionString;

        if (parameters) {
            functionString = `fn(${parameters})${returnType}`;
        } else {
            functionString = `fn()${returnType}`;
        }

        methodDefinition["!type"] = functionString;
        const documentation = _prepareDocumentation(method);

        if (functionString === "fn(oParameters<br>: {}) -> {}") {
            console.log(method);
        }

        if (documentation) {
            methodDefinition["!doc"] = documentation;
        }

        if (apiDocUrlBase) {
            methodDefinition["!url"] = `${apiDocUrlBase}/methods/${method.name}`;
        }
    }

    function _prepareParameters(parameters) {
        if (!parameters || parameters.length === 0) {
            return "";
        }

        let result = "";

        parameters.forEach((param) => {
            const typeSpec = getType(param.type);
            let paramTypeString = "?";

            if (typeSpec) {
                paramTypeString = typeSpec.type;
            }

            result += `${_sanitazeName(param.name)}${param.optional ? "?" : ""}: ${paramTypeString}, `;
        });

        result = result.slice(0, -2);

        return result;
    }

    function _sanitazeName(name) {
        let result = name;

        result = result.replace(/[\][{}:<>+]/g, "");

        if (result.trim() === "") {
            result = "p";
        }

        return result;
    }

    exports.prepareUi5Symbol = prepareUi5Symbol;
    exports.preparePropertiesDefinitions = preparePropertiesDefinitions;
    exports.prepareMethodsDefinitions = prepareMethodsDefinitions;
    exports.getType = getType;
    exports.getFunctionReturnType = getFunctionReturnType;
    exports.prepareNamespace = prepareNamespace;
    exports.prepareClass = prepareClass;
});
