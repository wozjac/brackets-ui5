define((require, exports) => {
    "use strict";

    const ui5Tern = require("src/code/ui5TernDefinitions"),
        ui5ApiService = require("src/core/ui5ApiService"),
        testUtils = require("tests/testUtils");

    exports.getTests = function () {
        let ui5ObjectsLoaded,
            ui5LibrariesLoaded;

        const propertiesFixtures = [{
            "name": "vAlign",
            "type": "sap.ui.core.VerticalAlign",
            "defaultValue": "Inherit",
            "group": "Appearance",
            "visibility": "public",
            "since": "1.20",
            "description": "Sets the vertical alignment of all the cells within the table row (including selection and navigation). <b>Note:</b> <code>vAlign</code> property of <code>sap.m.Column</code> overrides the property for cell vertical alignment if both are set.",
            "methods": ["getVAlign", "setVAlign"],
            "apiDocUrl": "https://api.com/sap.apf.base.Component"
        }, {
            "name": "define",
            "module": "ui5loader",
            "visibility": "public",
            "static": true,
            "since": "1.27.0",
            "type": "undefined",
            "description": "Defines a Javascript module with its name, its dependencies and a module value or factory.\n\nThe typical and only suggested usage of this method is to have one single, top level call to <code>sap.ui.define</code> in one Javascript resource (file). When a module is requested by its name for the first time, the corresponding resource is determined from the name and the current {@link jQuery.sap.registerResourcePath configuration}.",
            "apiDocUrl": "https://api.com/sap.apf.base.Component"
        }];

        const methodFixtures = [{
            "name": "attachToggleOpenState",
            "visibility": "public",
            "returnValue": {
                "type": "sap.m.Tree",
                "description": "Reference to <code>this</code> in order to allow method chaining"
            },
            "since": "1.50",
            "parameters": [{
                "name": "oData",
                "type": "object",
                "optional": true,
                "description": "An application-specific payload object that will be passed to the event handler along with the event object when firing the event"
                }, {
                "name": "fnFunction",
                "type": "function",
                "optional": false,
                "description": "The function to be called when the event occurs"
                }, {
                "name": "oListener",
                "type": "object",
                "optional": true,
                "description": "Context object to call the event handler with. Defaults to this <code>sap.m.Tree</code> itself"
                }],
            "description": "Attaches event handler <code>fnFunction</code> to the {@link #event:toggleOpenState toggleOpenState} event of this <code>sap.m.Tree</code>.\r\rWhen called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener</code> if specified, \rotherwise it will be bound to this <code>sap.m.Tree</code> itself.\r\rFired when an item has been expanded or collapsed by user interaction.",
            "apiDocUrl": "https://api.com/sap.apf.base.Component"
            }, {
            "name": "attachHandler",
            "visibility": "public",
            "static": true,
            "parameters": [{
                "name": "fnFunction",
                "type": "function",
                "optional": false,
                "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the <code>window</code> instance. A map with information about the orientation is provided as a single argument to the handler (see details above)."
            }, {
                "name": "oListener",
                "type": "object",
                "optional": true,
                "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the <code>window</code>."
            }],
            "description": "Registers the given event handler to orientation change events of the document's window.\n\nThe event is fired whenever the screen orientation changes and the width of the document's window becomes greater than its height or the other way round.\n\nThe event handler is called with a single argument: a map <code>mParams</code> which provides the following information: <ul> <li><code>mParams.landscape</code>: If this flag is set to <code>true</code>, the screen is currently in landscape mode, otherwise in portrait mode.</li> </ul>",
            "apiDocUrl": "https://api.com/sap.apf.base.Component"
        }];

        const classFixture = {
            "kind": "class",
            "name": "sap.apf.base.Component",
            "basename": "Component",
            "resource": "sap/apf/base/Component.js",
            "module": "sap/apf/base/Component",
            "export": "",
            "static": true,
            "visibility": "public",
            "since": "undefined",
            "extends": "sap.ui.core.UIComponent",
            "description": "Base Component for all APF based applications.",
            "apiDocUrl": "https://api.com/sap.apf.base.Component",
            "methods": methodFixtures,
            "properties": propertiesFixtures
        };

        describe("[wozjac.ui5] ui5Tern.js", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();

                ui5ApiService.loadUi5Objects().then(() => {
                    ui5ObjectsLoaded = true;

                    ui5ApiService.loadUi5LibrariesDesignApi().then(() => {
                        ui5LibrariesLoaded = true;
                    });
                });

                waitsFor(() => {
                    return ui5ObjectsLoaded === true && ui5LibrariesLoaded === true;
                }, "should load ui5 objects", 500);
            });

            it("Should return 'string' type (simple and array)", () => {
                expect(ui5Tern.getType("String")).toEqual({
                    type: "string",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("string")).toEqual({
                    type: "string",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("string[]")).toEqual({
                    type: "[string]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("String[]")).toEqual({
                    type: "[string]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("StRinG[]")).toEqual({
                    type: "[string]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return 'bool' type (simple and array)", () => {
                expect(ui5Tern.getType("boolean")).toEqual({
                    type: "bool",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Boolean")).toEqual({
                    type: "bool",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("boolean[]")).toEqual({
                    type: "[bool]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Boolean[]")).toEqual({
                    type: "[bool]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("BOOLEan[]")).toEqual({
                    type: "[bool]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return 'number' type (simple and array)", () => {
                expect(ui5Tern.getType("int")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Int")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Integer")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("int[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Int[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("INT[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("float")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Float")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("float[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Float[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("FLOAt[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("number")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Number")).toEqual({
                    type: "number",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("number[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Number[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("NUMBer[]")).toEqual({
                    type: "[number]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return '{}' type (simple and array)", () => {
                expect(ui5Tern.getType("object")).toEqual({
                    type: "{}",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Object")).toEqual({
                    type: "{}",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("object[]")).toEqual({
                    type: "[{}]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Object[]")).toEqual({
                    type: "[{}]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("OBJEct[]")).toEqual({
                    type: "[{}]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("map")).toEqual({
                    type: "{}",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Map")).toEqual({
                    type: "{}",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("map[]")).toEqual({
                    type: "[{}]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Map[]")).toEqual({
                    type: "[{}]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("MAP[]")).toEqual({
                    type: "[{}]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return '?' type (simple and array)", () => {
                expect(ui5Tern.getType("any")).toEqual({
                    type: "?",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Any")).toEqual({
                    type: "?",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("any[]")).toEqual({
                    type: "[?]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Any[]")).toEqual({
                    type: "[?]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("aNY[]")).toEqual({
                    type: "[?]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return 'date' type (simple and array)", () => {
                expect(ui5Tern.getType("date")).toEqual({
                    type: "date",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Date")).toEqual({
                    type: "date",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("date[]")).toEqual({
                    type: "[date]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Date[]")).toEqual({
                    type: "[date]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("DATE[]")).toEqual({
                    type: "[date]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return '[]' type", () => {
                expect(ui5Tern.getType("array")).toEqual({
                    type: "[]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("Array")).toEqual({
                    type: "[]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("ARRay")).toEqual({
                    type: "[]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return 'fn()' type", () => {
                expect(ui5Tern.getType("function")).toEqual({
                    type: "fn()",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: true,
                    isObject: false
                });

                expect(ui5Tern.getType("Function")).toEqual({
                    type: "fn()",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: true,
                    isObject: false
                });

                expect(ui5Tern.getType("FuNCTion")).toEqual({
                    type: "fn()",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: true,
                    isObject: false
                });
            });

            it("Should return namespaced object type (and array type)", () => {
                expect(ui5Tern.getType("sap.ui.base.Object")).toEqual({
                    type: "sap.ui.base.Object",
                    isArray: false,
                    isNamespacedSapObject: true,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("sap.ui.base.Object[]")).toEqual({
                    type: "[sap.ui.base.Object]",
                    isArray: true,
                    isNamespacedSapObject: true,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("module:sap/ui/base/Object")).toEqual({
                    type: "sap.ui.base.Object",
                    isArray: false,
                    isNamespacedSapObject: true,
                    isFunction: false,
                    isObject: false
                });

                expect(ui5Tern.getType("module:sap/ui/base/Object[]")).toEqual({
                    type: "[sap.ui.base.Object]",
                    isArray: true,
                    isNamespacedSapObject: true,
                    isFunction: false,
                    isObject: false
                });
            });

            it("Should return an object type (and its array type)", () => {
                expect(ui5Tern.getType("Element")).toEqual({
                    type: "Element",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: true
                });

                expect(ui5Tern.getType("Element[]")).toEqual({
                    type: "[Element]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: true
                });

                expect(ui5Tern.getType("Promise")).toEqual({
                    type: "Promise",
                    isArray: false,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: true
                });

                expect(ui5Tern.getType("Promise[]")).toEqual({
                    type: "[Promise]",
                    isArray: true,
                    isNamespacedSapObject: false,
                    isFunction: false,
                    isObject: true
                });
            });

            it("Should return null for 'undefined' and 'null' strings", () => {
                expect(ui5Tern.getType("null")).toBeNull();
                expect(ui5Tern.getType("undefined")).toBeNull();
            });

            it("Should return null for excluded UI5 type strings", () => {
                expect(ui5Tern.getType("*")).toBeNull();
                expect(ui5Tern.getType("Error>")).toBeNull();
            });

            it("Should return empty string as a function return type", () => {
                expect(ui5Tern.getFunctionReturnType({
                    type: "*"
                })).toBe("");

                expect(ui5Tern.getFunctionReturnType({
                    type: "Error>"
                })).toBe("");

                expect(ui5Tern.getFunctionReturnType()).toBe("");
                expect(ui5Tern.getFunctionReturnType(null)).toBe("");
                expect(ui5Tern.getFunctionReturnType(undefined)).toBe("");

                expect(ui5Tern.getFunctionReturnType({
                    notype: "A"
                })).toBe("");
            });

            it("Should return empty string as a function return type", () => {
                expect(ui5Tern.getFunctionReturnType({
                    type: "*"
                })).toBe("");

                expect(ui5Tern.getFunctionReturnType({
                    type: "Error>"
                })).toBe("");

                expect(ui5Tern.getFunctionReturnType()).toBe("");
                expect(ui5Tern.getFunctionReturnType(null)).toBe("");
                expect(ui5Tern.getFunctionReturnType(undefined)).toBe("");

                expect(ui5Tern.getFunctionReturnType({
                    notype: "A"
                })).toBe("");
            });

            it("Should return namespaced object instance return type", () => {
                expect(ui5Tern.getFunctionReturnType({
                    type: "sap.ui.core.Item"
                })).toBe(" -> +sap.ui.core.Item");
            });

            it("Should return property definition", () => {
                const definitions = {};
                ui5Tern.preparePropertiesDefinitions(definitions, classFixture);

                expect(definitions).toEqual({
                    define: {
                        "!type": "?",
                        "!doc": "Defines a Javascript module with its name, its dependencies and a module value or factory. The typical and only suggested usage of...",
                        "!url": "https://api.com/sap.apf.base.Component/controlProperties"
                    },
                    prototype: {
                        "vAlign": {
                            "!type": "+sap.ui.core.VerticalAlign",
                            "!doc": "Sets the vertical alignment of all the cells within the table row (including selection and navigation). Note: vAlign property of s...",
                            "!url": "https://api.com/sap.apf.base.Component/controlProperties"
                        }
                    }
                });
            });

            it("Should return method definitions", () => {
                const definitions = {};
                ui5Tern.prepareMethodsDefinitions(definitions, classFixture);

                expect(definitions).toEqual({
                    attachHandler: {
                        "!type": "fn(fnFunction: fn(), oListener?: {})",
                        "!doc": "Registers the given event handler to orientation change events of the document's window. The event is fired whenever the screen or...",
                        "!url": "https://api.com/sap.apf.base.Component/methods/attachHandler"
                    },
                    prototype: {
                        "attachToggleOpenState": {
                            "!type": "fn(oData?: {}, fnFunction: fn(), oListener?: {}) -> +sap.m.Tree",
                            "!doc": "Attaches event handler fnFunction to the :toggleOpenState toggleOpenState event of this sap.m.Tree. When called, the context of th...",
                            "!url": "https://api.com/sap.apf.base.Component/methods/attachToggleOpenState"
                        }
                    }
                });
            });

            it("Should return class definition", () => {
                const definition = {};
                ui5Tern.prepareUi5Symbol(definition, classFixture);

                expect(definition).toEqual({
                    "!type": "fn()",
                    "!doc": "Base Component for all APF based applications.",
                    "!url": "https://api.com/sap.apf.base.Component",
                    "define": {
                        "!type": "?",
                        "!doc": "Defines a Javascript module with its name, its dependencies and a module value or factory. The typical and only suggested usage of...",
                        "!url": "https://api.com/sap.apf.base.Component/controlProperties"
                    },
                    "attachHandler": {
                        "!type": "fn(fnFunction: fn(), oListener?: {})",
                        "!doc": "Registers the given event handler to orientation change events of the document's window. The event is fired whenever the screen or...",
                        "!url": "https://api.com/sap.apf.base.Component/methods/attachHandler"
                    },
                    prototype: {
                        "!proto": "sap.ui.core.UIComponent.prototype",
                        "vAlign": {
                            "!type": "+sap.ui.core.VerticalAlign",
                            "!doc": "Sets the vertical alignment of all the cells within the table row (including selection and navigation). Note: vAlign property of s...",
                            "!url": "https://api.com/sap.apf.base.Component/controlProperties"
                        },
                        "attachToggleOpenState": {
                            "!type": "fn(oData?: {}, fnFunction: fn(), oListener?: {}) -> +sap.m.Tree",
                            "!doc": "Attaches event handler fnFunction to the :toggleOpenState toggleOpenState event of this sap.m.Tree. When called, the context of th...",
                            "!url": "https://api.com/sap.apf.base.Component/methods/attachToggleOpenState"
                        }
                    }
                });
            });
        });
    };
});
