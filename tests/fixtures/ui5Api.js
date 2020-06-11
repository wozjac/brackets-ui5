define((require, exports) => {
    "use strict";

    exports.ui5ApiObjects = {
        "sap.ui.base.Object": {
            name: "sap.ui.base.Object",
            originalName: "sap.ui.base.Object",
            basename: "Object",
            kind: "class",
            library: "sap.ui.core",
            apiDocUrl: "https://openui5.hana.ondemand.com/#/api/sap.ui.base.Object"
        },
        "sap.ui.base.EventProvider": {
            name: "sap.ui.base.EventProvider",
            originalName: "sap.ui.base.EventProvider",
            basename: "EventProvider",
            kind: "class",
            library: "sap.ui.core",
            apiDocUrl: "https://openui5.hana.ondemand.com/#/api/sap.ui.base.EventProvider"
        },
        "sap.m.Tree": {
            name: "sap.m.Tree",
            originalName: "sap.m.Tree",
            basename: "Tree",
            kind: "class",
            library: "sap.m",
            apiDocUrl: "https://openui5.hana.ondemand.com/#/api/sap.m.Tree"
        },
        "sap.m.ColumnListItem": {
            name: "sap.m.ColumnListItem",
            originalName: "sap.m.ColumnListItem",
            basename: "ColumnListItem",
            kind: "class",
            library: "sap.m",
            apiDocUrl: "https://openui5.hana.ondemand.com/#/api/sap.m.ColumnListItem"
        },
        "jQuery.Event": {
            name: "jQuery.Event",
            originalName: "jQuery.Event",
            basename: "Event",
            kind: "class",
            library: "sap.ui.core",
            apiDocUrl: "https://openui5.hana.ondemand.com/#/api/jQuery.Event"
        },
        "sap.ui": {
            name: "sap.ui",
            originalName: "sap.ui",
            basename: "ui",
            kind: "namespace",
            library: "sap.ui.core",
            apiDocUrl: "https://openui5.hana.ondemand.com/#/api/sap.ui"
        }
    };

    exports.apiIndex = {
        "$schema-ref": "http://schemas.sap.com/sapui5/designtime/api.json/1.0",
        "version": "1.50.8",
        "library": "*",
        "symbols": [{
            "name": "sap.ui.base.Object",
            "kind": "class",
            "visibility": "public",
            "lib": "sap.ui.core",
            "extendedBy": ["sap.ui.base.Event", "sap.ui.base.EventProvider", "sap.ui.base.ManagedObjectObserver", "sap.ui.base.ObjectPool", "sap.ui.core.Configuration", "sap.ui.core.Configuration.FormatSettings", "sap.ui.core.Core", "sap.ui.core.delegate.ScrollEnablement", "sap.ui.core.EventBus", "sap.ui.core.format.FileSizeFormat", "sap.ui.core.format.NumberFormat", "sap.ui.core.History", "sap.ui.core.IntervalTrigger", "sap.ui.core.Locale", "sap.ui.core.LocaleData", "sap.ui.core.Manifest", "sap.ui.core.message.Message", "sap.ui.core.message.MessageParser", "sap.ui.core.ResizeHandler", "sap.ui.core.service.Service", "sap.ui.core.service.ServiceFactory", "sap.ui.core.support.Plugin", "sap.ui.model.Context", "sap.ui.model.DataState", "sap.ui.model.Filter", "sap.ui.model.odata.Filter", "sap.ui.model.Sorter", "sap.ui.model.Type", "sap.ui.test.gherkin.StepDefinitions", "sap.ui.test.Opa5", "sap.ui.test.OpaExtension", "sap.ui.test.OpaPlugin", "sap.ui.test.PageObjectFactory", "sap.f.routing.TargetHandler", "sap.m.GrowingEnablement", "sap.m.routing.RouteMatchedHandler", "sap.m.routing.TargetHandler", "sap.ui.documentation.sdk.controller.ErrorHandler"]
    }, {
            "name": "sap.ui.base.EventProvider",
            "kind": "class",
            "visibility": "public",
            "extends": "sap.ui.base.Object",
            "lib": "sap.ui.core",
            "extendedBy": ["sap.ui.base.ManagedObject", "sap.ui.core.delegate.ItemNavigation", "sap.ui.core.message.MessageManager", "sap.ui.core.message.MessageProcessor", "sap.ui.core.mvc.Controller", "sap.ui.core.routing.HashChanger", "sap.ui.core.routing.Route", "sap.ui.core.routing.Router", "sap.ui.core.routing.Target", "sap.ui.core.routing.Targets", "sap.ui.core.routing.Views", "sap.ui.core.util.serializer.delegate.Delegate", "sap.ui.core.util.serializer.HTMLViewSerializer", "sap.ui.core.util.serializer.Serializer", "sap.ui.core.util.serializer.ViewSerializer", "sap.ui.core.util.serializer.XMLViewSerializer", "sap.ui.core.ws.WebSocket", "sap.ui.model.Binding", "sap.ui.model.odata.ODataAnnotations", "sap.ui.model.odata.ODataMetadata", "sap.ui.model.odata.v2.ODataAnnotations", "sap.ui.model.SelectionModel"]
    }, {
            "name": "sap.m.Tree",
            "kind": "class",
            "visibility": "public",
            "extends": "sap.m.ListBase",
            "lib": "sap.m"
    }, {
            "name": "sap.m.ColumnListItem",
            "kind": "class",
            "visibility": "public",
            "extends": "sap.m.ListItemBase",
            "lib": "sap.m"
    }, {
            "name": "jQuery.Event",
            "kind": "class",
            "visibility": "public",
            "lib": "sap.ui.core"
    }, {
            "name": "sap.ui",
            "kind": "namespace",
            "visibility": "public",
            "lib": "sap.ui.core"
    }]
    };

    exports.sapUiCoreApi = {
        "$schema-ref": "http://schemas.sap.com/sapui5/designtime/api.json/1.0",
        "version": "1.54.6",
        "library": "sap.ui.core",
        "symbols": [{
                "kind": "class",
                "name": "sap.ui.base.EventProvider",
                "basename": "EventProvider",
                "resource": "sap/ui/base/EventProvider.js",
                "module": "sap/ui/base/EventProvider",
                "export": "",
                "abstract": true,
                "static": true,
                "visibility": "public",
                "extends": "sap.ui.base.Object",
                "description": "Provides eventing capabilities for objects like attaching or detaching event handlers for events which are notified when events are fired.",
                "ui5-metadata": {
                    "stereotype": "object"
                },
                "constructor": {
                    "visibility": "public",
                    "description": "Creates an instance of EventProvider."
                },
                "methods": [{
                    "name": "attachEvent",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to listen for"
            }, {
                        "name": "oData",
                        "type": "object",
                        "optional": true,
                        "description": "An object that will be passed to the handler along with the event object when the event is fired"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the event provider instance. The event object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change the content of the event. The second argument is the specified <code>oData</code> instance (if present)."
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the event provider."
            }],
                    "description": "Attaches an event handler to the event with the given identifier."
        }, {
                    "name": "attachEventOnce",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to listen for"
            }, {
                        "name": "oData",
                        "type": "object",
                        "optional": true,
                        "description": "An object that will be passed to the handler along with the event object when the event is fired"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the event provider instance. The event object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change the content of the event. The second argument is the specified <code>oData</code> instance (if present)."
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the event provider."
            }],
                    "description": "Attaches an event handler, called one time only, to the event with the given identifier.\n\nWhen the event occurs, the handler function is called and the handler registration is automatically removed afterwards."
        }, {
                    "name": "destroy",
                    "visibility": "public",
                    "description": "Cleans up the internal structures and removes all event handlers.\n\nThe object must not be used anymore after destroy was called.",
                    "references": ["sap.ui.base.Object#destroy"]
        }, {
                    "name": "detachEvent",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to detach from"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to detach from the event"
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The object that wanted to be notified when the event occurred"
            }],
                    "description": "Removes a previously attached event handler from the event with the given identifier.\n\nThe passed parameters must match those used for registration with {@link #attachEvent} beforehand."
        }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "Created class / constructor function"
                    },
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "Name of the class being created"
            }, {
                        "name": "oClassInfo",
                        "type": "object",
                        "optional": true,
                        "description": "Object literal with information about the class"
            }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "Constructor function for the metadata object; if not given, it defaults to <code>sap.ui.core.ElementMetadata</code>"
            }],
                    "description": "Creates a new subclass of class sap.ui.base.EventProvider with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain the same kind of information as described in {@link sap.ui.base.Object.extend}."
        }, {
                    "name": "fireEvent",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider|boolean",
                        "description": "Returns <code>this</code> to allow method chaining. When <code>preventDefault</code> is supported on the fired event the function returns <code>true</code> if the default action should be executed, <code>false</code> otherwise."
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to fire"
            }, {
                        "name": "mParameters",
                        "type": "object",
                        "optional": true,
                        "description": "The parameters which should be carried by the event"
            }, {
                        "name": "bAllowPreventDefault",
                        "type": "boolean",
                        "optional": true,
                        "description": "Defines whether function <code>preventDefault</code> is supported on the fired event"
            }, {
                        "name": "bEnableEventBubbling",
                        "type": "boolean",
                        "optional": true,
                        "description": "Defines whether event bubbling is enabled on the fired event. Set to <code>true</code> the event is also forwarded to the parent(s) of the event provider ({@link #getEventingParent}) until the bubbling of the event is stopped or no parent is available anymore."
            }],
                    "description": "Fires an {@link sap.ui.base.Event event} with the given settings and notifies all attached event handlers."
        }, {
                    "name": "getEventingParent",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "The parent event provider"
                    },
                    "description": "Returns the parent in the eventing hierarchy of this object.\n\nPer default this returns null, but if eventing is used in objects, which are hierarchically structured, this can be overwritten to make the object hierarchy visible to the eventing and enables the use of event bubbling within this object hierarchy."
        }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "Metadata object describing this class"
                    },
                    "description": "Returns a metadata object for class sap.ui.base.EventProvider."
        }, {
                    "name": "hasListener",
                    "visibility": "restricted",
                    "static": true,
                    "returnValue": {
                        "type": "boolean",
                        "description": "Returns whether a listener with the same parameters exists"
                    },
                    "parameters": [{
                        "name": "oEventProvider",
                        "type": "sap.ui.base.EventProvider",
                        "optional": false,
                        "description": "The event provider to get the registered events for"
            }, {
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to check listeners for"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to check for"
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The listener object to check for"
            }],
                    "description": "Checks whether the given event provider has the given listener registered for the given event.\n\nReturns true if function and listener object both match the corresponding parameters of at least one listener registered for the named event."
        }, {
                    "name": "hasListeners",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "boolean",
                        "description": "Whether there are any registered event handlers"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event"
            }],
                    "description": "Returns whether there are any registered event handlers for the event with the given identifier."
        }, {
                    "name": "toString",
                    "visibility": "public",
                    "returnValue": {
                        "type": "string",
                        "description": "A string description of this event provider"
                    },
                    "description": "Returns a string representation of this object.\n\nIn case there is no class or id information, a simple static string is returned. Subclasses should override this method."
            }]
        },
            {
                "kind": "class",
                "name": "sap.ui.base.Object",
                "basename": "Object",
                "resource": "sap/ui/base/Object.js",
                "module": "sap/ui/base/Object",
                "export": "",
                "abstract": true,
                "static": true,
                "visibility": "public",
                "description": "Base class for all SAPUI5 Objects",
                "ui5-metadata": {
                    "stereotype": "object"
                },
                "constructor": {
                    "visibility": "public",
                    "description": "Constructor for an sap.ui.base.Object."
                },
                "methods": [{
                    "name": "defineClass",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "the created metadata object"
                    },
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "name of an (already declared) constructor function"
                        }, {
                        "name": "oStaticInfo",
                        "type": "object",
                        "optional": false,
                        "parameterProperties": {
                            "baseType": {
                                "name": "baseType",
                                "type": "string",
                                "optional": false,
                                "description": "qualified name of a base class"
                            },
                            "publicMethods": {
                                "name": "publicMethods",
                                "type": "string[]",
                                "optional": false,
                                "description": "array of names of public methods"
                            }
                        },
                        "description": "static info used to create the metadata object"
            }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "constructor function for the metadata object. If not given, it defaults to sap.ui.base.Metadata."
            }],
                    "description": "Creates metadata for a given class and attaches it to the constructor and prototype of that class.\n\nAfter creation, metadata can be retrieved with getMetadata().\n\nThe static info can at least contain the following entries: <ul> <li>baseType: {string} fully qualified name of a base class or empty</li> <li>publicMethods: {string} an array of method names that will be visible in the interface proxy returned by {@link #getInterface}</li> </ul>",
                    "deprecated": {
                        "since": "1.3.1",
                        "text": "Use the static <code>extend</code> method of the desired base class (e.g. {@link sap.ui.base.Object.extend})"
                    }
        }, {
                    "name": "destroy",
                    "visibility": "public",
                    "description": "Destructor method for objects"
        }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "the created class / constructor function"
                    },
                    "since": "1.3.1",
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "name of the class to be created"
            }, {
                        "name": "oClassInfo",
                        "type": "object",
                        "optional": true,
                        "description": "structured object with informations about the class"
            }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "constructor function for the metadata object. If not given, it defaults to sap.ui.base.Metadata."
            }],
                    "description": "Creates a subclass of class sap.ui.base.Object with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain three kinds of informations: <ul> <li><code>metadata:</code> an (optional) object literal with metadata about the class. The information in the object literal will be wrapped by an instance of {@link sap.ui.base.Metadata Metadata} and might contain the following information <ul> <li><code>interfaces:</code> {string[]} (optional) set of names of implemented interfaces (defaults to no interfaces)</li> <li><code>publicMethods:</code> {string[]} (optional) list of methods that should be part of the public facade of the class</li> <li><code>abstract:</code> {boolean} (optional) flag that marks the class as abstract (purely informational, defaults to false)</li> <li><code>final:</code> {boolean} (optional) flag that marks the class as final (defaults to false)</li> </ul> Subclasses of sap.ui.base.Object can enrich the set of supported metadata (e.g. see {@link sap.ui.core.Element.extend}). </li>\n\n<li><code>constructor:</code> a function that serves as a constructor function for the new class. If no constructor function is given, the framework creates a default implementation that delegates all its arguments to the constructor function of the base class. </li>\n\n<li><i>any-other-name:</i> any other property in the <code>oClassInfo</code> is copied into the prototype object of the newly created class. Callers can thereby add methods or properties to all instances of the class. But be aware that the given values are shared between all instances of the class. Usually, it doesn't make sense to use primitive values here other than to declare public constants. </li>\n\n</ul>\n\nThe prototype object of the newly created class uses the same prototype as instances of the base class (prototype chaining).\n\nA metadata object is always created, even if there is no <code>metadata</code> entry in the <code>oClassInfo</code> object. A getter for the metadata is always attached to the prototype and to the class (constructor function) itself.\n\nLast but not least, with the third argument <code>FNMetaImpl</code> the constructor of a metadata class can be specified. Instances of that class will be used to represent metadata for the newly created class and for any subclass created from it. Typically, only frameworks will use this parameter to enrich the metadata for a new class hierarchy they introduce (e.g. {@link sap.ui.core.Element.extend Element})."
        }, {
                    "name": "getInterface",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.Interface",
                        "description": "the public interface of the object"
                    },
                    "description": "Returns the public interface of the object."
        }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "returnValue": {
                        "description": "{sap.ui.base.Metadata] metadata for the class of the object"
                    },
                    "description": "Returns the metadata for the class that this object belongs to.\n\nThis method is only defined when metadata has been declared by using {@link sap.ui.base.Object.defineClass} or {@link sap.ui.base.Object.extend}."
        }]
            }]
    };

    exports.sapUiCoreProcessedApi = {
        "$schema-ref": "http://schemas.sap.com/sapui5/designtime/api.json/1.0",
        "version": "1.54.6",
        "library": "sap.ui.core",
        "symbols": [{
                "kind": "class",
                "name": "sap.ui.base.EventProvider",
                "basename": "EventProvider",
                "resource": "sap/ui/base/EventProvider.js",
                "module": "sap/ui/base/EventProvider",
                "export": "",
                "abstract": true,
                "static": true,
                "visibility": "public",
                "extends": "sap.ui.base.Object",
                "description": "Provides eventing capabilities for objects like attaching or detaching event handlers for events which are notified when events are fired.",
                "ui5-metadata": {
                    "stereotype": "object"
                },
                "constructor": {
                    "visibility": "public",
                    "description": "Creates an instance of EventProvider."
                },
                "methods": [{
                    "name": "attachEvent",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to listen for"
            }, {
                        "name": "oData",
                        "type": "object",
                        "optional": true,
                        "description": "An object that will be passed to the handler along with the event object when the event is fired"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the event provider instance. The event object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change the content of the event. The second argument is the specified <code>oData</code> instance (if present)."
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the event provider."
            }],
                    "description": "Attaches an event handler to the event with the given identifier."
        }, {
                    "name": "attachEventOnce",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to listen for"
            }, {
                        "name": "oData",
                        "type": "object",
                        "optional": true,
                        "description": "An object that will be passed to the handler along with the event object when the event is fired"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to call when the event occurs. This function will be called in the context of the <code>oListener</code> instance (if present) or on the event provider instance. The event object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change the content of the event. The second argument is the specified <code>oData</code> instance (if present)."
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The object that wants to be notified when the event occurs (<code>this</code> context within the handler function). If it is not specified, the handler function is called in the context of the event provider."
            }],
                    "description": "Attaches an event handler, called one time only, to the event with the given identifier.\n\nWhen the event occurs, the handler function is called and the handler registration is automatically removed afterwards."
        }, {
                    "name": "destroy",
                    "visibility": "public",
                    "description": "Cleans up the internal structures and removes all event handlers.\n\nThe object must not be used anymore after destroy was called.",
                    "references": ["sap.ui.base.Object#destroy"]
        }, {
                    "name": "detachEvent",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "Returns <code>this</code> to allow method chaining"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to detach from"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to detach from the event"
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The object that wanted to be notified when the event occurred"
            }],
                    "description": "Removes a previously attached event handler from the event with the given identifier.\n\nThe passed parameters must match those used for registration with {@link #attachEvent} beforehand."
        }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "Created class / constructor function"
                    },
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "Name of the class being created"
            }, {
                        "name": "oClassInfo",
                        "type": "object",
                        "optional": true,
                        "description": "Object literal with information about the class"
            }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "Constructor function for the metadata object; if not given, it defaults to <code>sap.ui.core.ElementMetadata</code>"
            }],
                    "description": "Creates a new subclass of class sap.ui.base.EventProvider with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain the same kind of information as described in {@link sap.ui.base.Object.extend}."
        }, {
                    "name": "fireEvent",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider|boolean",
                        "description": "Returns <code>this</code> to allow method chaining. When <code>preventDefault</code> is supported on the fired event the function returns <code>true</code> if the default action should be executed, <code>false</code> otherwise."
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to fire"
            }, {
                        "name": "mParameters",
                        "type": "object",
                        "optional": true,
                        "description": "The parameters which should be carried by the event"
            }, {
                        "name": "bAllowPreventDefault",
                        "type": "boolean",
                        "optional": true,
                        "description": "Defines whether function <code>preventDefault</code> is supported on the fired event"
            }, {
                        "name": "bEnableEventBubbling",
                        "type": "boolean",
                        "optional": true,
                        "description": "Defines whether event bubbling is enabled on the fired event. Set to <code>true</code> the event is also forwarded to the parent(s) of the event provider ({@link #getEventingParent}) until the bubbling of the event is stopped or no parent is available anymore."
            }],
                    "description": "Fires an {@link sap.ui.base.Event event} with the given settings and notifies all attached event handlers."
        }, {
                    "name": "getEventingParent",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.ui.base.EventProvider",
                        "description": "The parent event provider"
                    },
                    "description": "Returns the parent in the eventing hierarchy of this object.\n\nPer default this returns null, but if eventing is used in objects, which are hierarchically structured, this can be overwritten to make the object hierarchy visible to the eventing and enables the use of event bubbling within this object hierarchy."
        }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "Metadata object describing this class"
                    },
                    "description": "Returns a metadata object for class sap.ui.base.EventProvider."
        }, {
                    "name": "hasListener",
                    "visibility": "restricted",
                    "static": true,
                    "returnValue": {
                        "type": "boolean",
                        "description": "Returns whether a listener with the same parameters exists"
                    },
                    "parameters": [{
                        "name": "oEventProvider",
                        "type": "sap.ui.base.EventProvider",
                        "optional": false,
                        "description": "The event provider to get the registered events for"
            }, {
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event to check listeners for"
            }, {
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The handler function to check for"
            }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": true,
                        "description": "The listener object to check for"
            }],
                    "description": "Checks whether the given event provider has the given listener registered for the given event.\n\nReturns true if function and listener object both match the corresponding parameters of at least one listener registered for the named event."
        }, {
                    "name": "hasListeners",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "boolean",
                        "description": "Whether there are any registered event handlers"
                    },
                    "parameters": [{
                        "name": "sEventId",
                        "type": "string",
                        "optional": false,
                        "description": "The identifier of the event"
            }],
                    "description": "Returns whether there are any registered event handlers for the event with the given identifier."
        }, {
                    "name": "toString",
                    "visibility": "public",
                    "returnValue": {
                        "type": "string",
                        "description": "A string description of this event provider"
                    },
                    "description": "Returns a string representation of this object.\n\nIn case there is no class or id information, a simple static string is returned. Subclasses should override this method."
            }]
        },
            {
                "kind": "class",
                "name": "sap.ui.base.Object",
                "basename": "Object",
                "resource": "sap/ui/base/Object.js",
                "module": "sap/ui/base/Object",
                "export": "",
                "abstract": true,
                "static": true,
                "visibility": "public",
                "description": "Base class for all SAPUI5 Objects",
                "ui5-metadata": {
                    "stereotype": "object"
                },
                "constructor": {
                    "visibility": "public",
                    "description": "Constructor for an sap.ui.base.Object."
                },
                "methods": [{
                    "name": "defineClass",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "the created metadata object"
                    },
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "name of an (already declared) constructor function"
            }, {
                        "name": "oStaticInfo",
                        "type": "object",
                        "optional": false,
                        "parameterProperties": {
                            "baseType": {
                                "name": "baseType",
                                "type": "string",
                                "optional": false,
                                "description": "qualified name of a base class"
                            },
                            "publicMethods": {
                                "name": "publicMethods",
                                "type": "string[]",
                                "optional": false,
                                "description": "array of names of public methods"
                            }
                        },
                        "description": "static info used to create the metadata object"
            }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "constructor function for the metadata object. If not given, it defaults to sap.ui.base.Metadata."
            }],
                    "description": "Creates metadata for a given class and attaches it to the constructor and prototype of that class.\n\nAfter creation, metadata can be retrieved with getMetadata().\n\nThe static info can at least contain the following entries: <ul> <li>baseType: {string} fully qualified name of a base class or empty</li> <li>publicMethods: {string} an array of method names that will be visible in the interface proxy returned by {@link #getInterface}</li> </ul>",
                    "deprecated": {
                        "since": "1.3.1",
                        "text": "Use the static <code>extend</code> method of the desired base class (e.g. {@link sap.ui.base.Object.extend})"
                    }
        }, {
                    "name": "destroy",
                    "visibility": "public",
                    "description": "Destructor method for objects"
        }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "the created class / constructor function"
                    },
                    "since": "1.3.1",
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "name of the class to be created"
            }, {
                        "name": "oClassInfo",
                        "type": "object",
                        "optional": true,
                        "description": "structured object with informations about the class"
            }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "constructor function for the metadata object. If not given, it defaults to sap.ui.base.Metadata."
            }],
                    "description": "Creates a subclass of class sap.ui.base.Object with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain three kinds of informations: <ul> <li><code>metadata:</code> an (optional) object literal with metadata about the class. The information in the object literal will be wrapped by an instance of {@link sap.ui.base.Metadata Metadata} and might contain the following information <ul> <li><code>interfaces:</code> {string[]} (optional) set of names of implemented interfaces (defaults to no interfaces)</li> <li><code>publicMethods:</code> {string[]} (optional) list of methods that should be part of the public facade of the class</li> <li><code>abstract:</code> {boolean} (optional) flag that marks the class as abstract (purely informational, defaults to false)</li> <li><code>final:</code> {boolean} (optional) flag that marks the class as final (defaults to false)</li> </ul> Subclasses of sap.ui.base.Object can enrich the set of supported metadata (e.g. see {@link sap.ui.core.Element.extend}). </li>\n\n<li><code>constructor:</code> a function that serves as a constructor function for the new class. If no constructor function is given, the framework creates a default implementation that delegates all its arguments to the constructor function of the base class. </li>\n\n<li><i>any-other-name:</i> any other property in the <code>oClassInfo</code> is copied into the prototype object of the newly created class. Callers can thereby add methods or properties to all instances of the class. But be aware that the given values are shared between all instances of the class. Usually, it doesn't make sense to use primitive values here other than to declare public constants. </li>\n\n</ul>\n\nThe prototype object of the newly created class uses the same prototype as instances of the base class (prototype chaining).\n\nA metadata object is always created, even if there is no <code>metadata</code> entry in the <code>oClassInfo</code> object. A getter for the metadata is always attached to the prototype and to the class (constructor function) itself.\n\nLast but not least, with the third argument <code>FNMetaImpl</code> the constructor of a metadata class can be specified. Instances of that class will be used to represent metadata for the newly created class and for any subclass created from it. Typically, only frameworks will use this parameter to enrich the metadata for a new class hierarchy they introduce (e.g. {@link sap.ui.core.Element.extend Element})."
        }, {
                    "name": "getInterface",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.base.Interface",
                        "description": "the public interface of the object"
                    },
                    "description": "Returns the public interface of the object."
        }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "returnValue": {
                        "description": "{sap.ui.base.Metadata] metadata for the class of the object"
                    },
                    "description": "Returns the metadata for the class that this object belongs to.\n\nThis method is only defined when metadata has been declared by using {@link sap.ui.base.Object.defineClass} or {@link sap.ui.base.Object.extend}."
        }]
            }]
    };

    exports.sapMApi = {
        "$schema-ref": "http://schemas.sap.com/sapui5/designtime/api.json/1.0",
        "version": "1.50.8",
        "library": "sap.m",
        "symbols": [{
                "kind": "class",
                "name": "sap.m.Tree",
                "basename": "Tree",
                "resource": "sap/m/Tree.js",
                "module": "sap/m/Tree",
                "export": "",
                "static": true,
                "visibility": "public",
                "since": "1.42",
                "extends": "sap.m.ListBase",
                "description": "The <code>Tree</code> control provides a tree structure for displaying data in a hierarchy.\n<b>Note:</b> Growing feature is not supported by <code>Tree</code>.",
                "ui5-metadata": {
                    "stereotype": "control",
                    "events": [{
                        "name": "toggleOpenState",
                        "visibility": "public",
                        "since": "1.50",
                        "description": "Fired when an item has been expanded or collapsed by user interaction.",
                        "parameters": {
                            "itemIndex": {
                                "name": "itemIndex",
                                "type": "int",
                                "description": "Index of the expanded/collapsed item"
                            },
                            "itemContext": {
                                "name": "itemContext",
                                "type": "object",
                                "description": "Binding context of the item"
                            },
                            "expanded": {
                                "name": "expanded",
                                "type": "boolean",
                                "description": "Flag that indicates whether the item has been expanded or collapsed"
                            }
                        },
                        "methods": [
                        "attachToggleOpenState",
                        "detachToggleOpenState",
                        "fireToggleOpenState"
                    ]
                }]
                },
                "constructor": {
                    "visibility": "public",
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "ID for the new control, generated automatically if no id is given"
                }, {
                        "name": "mSettings",
                        "type": "object",
                        "optional": true,
                        "description": "Initial settings for the new control"
                }],
                    "description": "Constructor for a new Tree.\n\n\nAccepts an object literal <code>mSettings</code> that defines initial\nproperty values, aggregated and associated objects as well as event handlers.\nSee {@link sap.ui.base.ManagedObject#constructor} for a general description of the syntax of the settings object."
                },
                "events": [{
                    "name": "toggleOpenState",
                    "visibility": "public",
                    "since": "1.50",
                    "parameters": [{
                        "name": "oControlEvent",
                        "type": "sap.ui.base.Event",
                        "parameterProperties": {
                            "getSource": {
                                "name": "getSource",
                                "type": "sap.ui.base.EventProvider",
                                "optional": false
                            },
                            "getParameters": {
                                "name": "getParameters",
                                "type": "object",
                                "optional": false,
                                "parameterProperties": {
                                    "itemIndex": {
                                        "name": "itemIndex",
                                        "type": "int",
                                        "optional": false,
                                        "description": "Index of the expanded/collapsed item"
                                    },
                                    "itemContext": {
                                        "name": "itemContext",
                                        "type": "object",
                                        "optional": false,
                                        "description": "Binding context of the item"
                                    },
                                    "expanded": {
                                        "name": "expanded",
                                        "type": "boolean",
                                        "optional": false,
                                        "description": "Flag that indicates whether the item has been expanded or collapsed"
                                    }
                                }
                            }
                        }
                }],
                    "description": "Fired when an item has been expanded or collapsed by user interaction."
            }],
                "methods": [{
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
                    "description": "Attaches event handler <code>fnFunction</code> to the {@link #event:toggleOpenState toggleOpenState} event of this <code>sap.m.Tree</code>.\r\rWhen called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener</code> if specified, \rotherwise it will be bound to this <code>sap.m.Tree</code> itself.\r\rFired when an item has been expanded or collapsed by user interaction."
            }, {
                    "name": "collapseAll",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "A reference to the Tree control"
                    },
                    "since": "1.48.0",
                    "description": "Collapses all nodes."
            }, {
                    "name": "detachToggleOpenState",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "since": "1.50",
                    "parameters": [{
                        "name": "fnFunction",
                        "type": "function",
                        "optional": false,
                        "description": "The function to be called, when the event occurs"
                }, {
                        "name": "oListener",
                        "type": "object",
                        "optional": false,
                        "description": "Context object on which the given function had to be called"
                }],
                    "description": "Detaches event handler <code>fnFunction</code> from the {@link #event:toggleOpenState toggleOpenState} event of this <code>sap.m.Tree</code>.\r\rThe passed function and listener object must match the ones used for event registration."
            }, {
                    "name": "expandToLevel",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "A reference to the Tree control"
                    },
                    "since": "1.48.0",
                    "parameters": [{
                        "name": "iLevel",
                        "type": "int",
                        "optional": false,
                        "description": "The level to which the data is expanded"
                }],
                    "description": "Defines the level to which the tree is expanded.\nThe function can be used to define the initial expanding state. An alternative way to define the initial expanding state is to set the parameter <code>numberOfExpandedLevels</code> of the binding.\n\nExample:\n<pre>\n  oTree.bindItems({\n     path: \"...\",\n     parameters: {\n        numberOfExpandedLevels: 1\n     }\n  });\n</pre>"
            }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "Created class / constructor function"
                    },
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "Name of the class being created"
                }, {
                        "name": "oClassInfo",
                        "type": "object",
                        "optional": true,
                        "description": "Object literal with information about the class"
                }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "Constructor function for the metadata object; if not given, it defaults to <code>sap.ui.core.ElementMetadata</code>"
                }],
                    "description": "Creates a new subclass of class sap.m.Tree with name <code>sClassName</code>\rand enriches it with the information contained in <code>oClassInfo</code>.\r\r<code>oClassInfo</code> might contain the same kind of information as described in {@link sap.m.ListBase.extend}."
            }, {
                    "name": "fireToggleOpenState",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "sap.m.Tree",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "since": "1.50",
                    "parameters": [{
                        "name": "mParameters",
                        "type": "object",
                        "optional": true,
                        "parameterProperties": {
                            "itemIndex": {
                                "name": "itemIndex",
                                "type": "int",
                                "optional": true,
                                "description": "Index of the expanded/collapsed item"
                            },
                            "itemContext": {
                                "name": "itemContext",
                                "type": "object",
                                "optional": true,
                                "description": "Binding context of the item"
                            },
                            "expanded": {
                                "name": "expanded",
                                "type": "boolean",
                                "optional": true,
                                "description": "Flag that indicates whether the item has been expanded or collapsed"
                            }
                        },
                        "description": "Parameters to pass along with the event"
                }],
                    "description": "Fires event {@link #event:toggleOpenState toggleOpenState} to attached listeners."
            }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "Metadata object describing this class"
                    },
                    "description": "Returns a metadata object for class sap.m.Tree."
            }, {
                    "name": "setGrowing",
                    "visibility": "public",
                    "description": "The <code>growing</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {}
            }, {
                    "name": "setGrowingDirection",
                    "visibility": "public",
                    "description": "The <code>growingDirection</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {}
            }, {
                    "name": "setGrowingScrollToLoad",
                    "visibility": "public",
                    "description": "The <code>growingScrollToLoad</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {}
            }, {
                    "name": "setGrowingThreshold",
                    "visibility": "public",
                    "description": "The <code>growingThreshold</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {}
            }, {
                    "name": "setGrowingTriggerText",
                    "visibility": "public",
                    "description": "The <code>growingTriggerText</code> property is not supported for control <code>Tree</code>.",
                    "deprecated": {}
            }]
        }, {
                "kind": "class",
                "name": "sap.m.ColumnListItem",
                "basename": "ColumnListItem",
                "resource": "sap/m/ColumnListItem.js",
                "module": "sap/m/ColumnListItem",
                "export": "",
                "static": true,
                "visibility": "public",
                "since": "1.12",
                "extends": "sap.m.ListItemBase",
                "description": "<code>sap.m.ColumnListItem</code> can be used with the <code>cells</code> aggregation to create rows for the <code>sap.m.Table</code> control. The <code>columns</code> aggregation of the <code>sap.m.Table</code> should match with the cells aggregation.\n\n<b>Note:</b> This control should only be used within the <code>sap.m.Table</code> control. The inherited <code>counter</code> property of <code>sap.m.ListItemBase</code> is not supported.",
                "ui5-metadata": {
                    "stereotype": "control",
                    "properties": [{
                        "name": "vAlign",
                        "type": "sap.ui.core.VerticalAlign",
                        "defaultValue": "Inherit",
                        "group": "Appearance",
                        "visibility": "public",
                        "since": "1.20",
                        "description": "Sets the vertical alignment of all the cells within the table row (including selection and navigation). <b>Note:</b> <code>vAlign</code> property of <code>sap.m.Column</code> overrides the property for cell vertical alignment if both are set.",
                        "methods": ["getVAlign", "setVAlign"]
                }],
                    "aggregations": [{
                        "name": "cells",
                        "singularName": "cell",
                        "type": "sap.ui.core.Control",
                        "cardinality": "0..n",
                        "visibility": "public",
                        "bindable": true,
                        "description": "Every <code>control</code> inside the <code>cells</code> aggregation defines one cell of the row. <b>Note:</b> The order of the <code>cells</code> aggregation must match the order of the <code>columns</code> aggregation of <code>sap.m.Table</code>.",
                        "methods": ["getCells", "destroyCells", "insertCell", "addCell", "removeCell", "indexOfCell", "removeAllCells", "bindCells", "unbindCells"]
                }],
                    "defaultAggregation": "cells"
                },
                "constructor": {
                    "visibility": "public",
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "Id for the new control, generated automatically if no id is given"
                }, {
                        "name": "mSettings",
                        "type": "object",
                        "optional": true,
                        "description": "Initial settings for the new control"
                }],
                    "description": "Constructor for a new ColumnListItem.\n\nAccepts an object literal <code>mSettings</code> that defines initial property values, aggregated and associated objects as well as event handlers. See {@link sap.ui.base.ManagedObject#constructor} for a general description of the syntax of the settings object."
                },
                "methods": [{
                    "name": "$Popin",
                    "visibility": "protected",
                    "since": "1.26",
                    "description": "Returns pop-in DOMRef as a jQuery Object"
            }, {
                    "name": "addCell",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.ColumnListItem",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "parameters": [{
                        "name": "oCell",
                        "type": "sap.ui.core.Control",
                        "optional": false,
                        "description": "The cell to add; if empty, nothing is inserted"
                }],
                    "description": "Adds some cell to the aggregation {@link #getCells cells}."
            }, {
                    "name": "bindCells",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.ColumnListItem",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "parameters": [{
                        "name": "oBindingInfo",
                        "type": "object",
                        "optional": false,
                        "description": "The binding information"
                }],
                    "description": "Binds aggregation {@link #getCells cells} to model data.\n\nSee {@link sap.ui.base.ManagedObject#bindAggregation ManagedObject.bindAggregation} for a detailed description of the possible properties of <code>oBindingInfo</code>."
            }, {
                    "name": "destroyCells",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.ColumnListItem",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "description": "Destroys all the cells in the aggregation {@link #getCells cells}."
            }, {
                    "name": "extend",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "function",
                        "description": "Created class / constructor function"
                    },
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "Name of the class being created"
                }, {
                        "name": "oClassInfo",
                        "type": "object",
                        "optional": true,
                        "description": "Object literal with information about the class"
                }, {
                        "name": "FNMetaImpl",
                        "type": "function",
                        "optional": true,
                        "description": "Constructor function for the metadata object; if not given, it defaults to <code>sap.ui.core.ElementMetadata</code>"
                }],
                    "description": "Creates a new subclass of class sap.m.ColumnListItem with name <code>sClassName</code> and enriches it with the information contained in <code>oClassInfo</code>.\n\n<code>oClassInfo</code> might contain the same kind of information as described in {@link sap.m.ListItemBase.extend}."
            }, {
                    "name": "getCells",
                    "visibility": "public",
                    "returnValue": {
                        "type": "[object Object][]"
                    },
                    "description": "Gets content of aggregation {@link #getCells cells}.\n\nEvery <code>control</code> inside the <code>cells</code> aggregation defines one cell of the row. <b>Note:</b> The order of the <code>cells</code> aggregation must match the order of the <code>columns</code> aggregation of <code>sap.m.Table</code>."
            }, {
                    "name": "getMetadata",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.base.Metadata",
                        "description": "Metadata object describing this class"
                    },
                    "description": "Returns a metadata object for class sap.m.ColumnListItem."
            }, {
                    "name": "getPopin",
                    "visibility": "protected",
                    "since": "1.30.9",
                    "description": "Returns the pop-in element."
            }, {
                    "name": "getTabbables",
                    "visibility": "protected",
                    "returnValue": {
                        "type": "jQuery",
                        "description": "jQuery object"
                    },
                    "since": "1.26",
                    "description": "Returns the tabbable DOM elements as a jQuery collection When popin is available this separated dom should also be included"
            }, {
                    "name": "getVAlign",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.core.VerticalAlign",
                        "description": "Value of property <code>vAlign</code>"
                    },
                    "since": "1.20",
                    "description": "Gets current value of property {@link #getVAlign vAlign}.\n\nSets the vertical alignment of all the cells within the table row (including selection and navigation). <b>Note:</b> <code>vAlign</code> property of <code>sap.m.Column</code> overrides the property for cell vertical alignment if both are set.\n\nDefault value is <code>Inherit</code>."
            }, {
                    "name": "hasPopin",
                    "visibility": "protected",
                    "description": "Determines whether control has pop-in or not."
            }, {
                    "name": "indexOfCell",
                    "visibility": "public",
                    "returnValue": {
                        "type": "int",
                        "description": "The index of the provided control in the aggregation if found, or -1 otherwise"
                    },
                    "parameters": [{
                        "name": "oCell",
                        "type": "sap.ui.core.Control",
                        "optional": false,
                        "description": "The cell whose index is looked for"
                }],
                    "description": "Checks for the provided <code>sap.ui.core.Control</code> in the aggregation {@link #getCells cells}. and returns its index if found or -1 otherwise."
            }, {
                    "name": "insertCell",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.ColumnListItem",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "parameters": [{
                        "name": "oCell",
                        "type": "sap.ui.core.Control",
                        "optional": false,
                        "description": "The cell to insert; if empty, nothing is inserted"
                }, {
                        "name": "iIndex",
                        "type": "int",
                        "optional": false,
                        "description": "The <code>0</code>-based index the cell should be inserted at; for a negative value of <code>iIndex</code>, the cell is inserted at position 0; for a value greater than the current size of the aggregation, the cell is inserted at the last position"
                }],
                    "description": "Inserts a cell into the aggregation {@link #getCells cells}."
            }, {
                    "name": "removeAllCells",
                    "visibility": "public",
                    "returnValue": {
                        "type": "[object Object][]",
                        "description": "An array of the removed elements (might be empty)"
                    },
                    "description": "Removes all the controls from the aggregation {@link #getCells cells}.\n\nAdditionally, it unregisters them from the hosting UIArea."
            }, {
                    "name": "removeCell",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.ui.core.Control",
                        "description": "The removed cell or <code>null</code>"
                    },
                    "parameters": [{
                        "name": "vCell",
                        "type": "int|string|sap.ui.core.Control",
                        "optional": false,
                        "description": "The cell to remove or its index or id"
                }],
                    "description": "Removes a cell from the aggregation {@link #getCells cells}."
            }, {
                    "name": "removePopin",
                    "visibility": "protected",
                    "description": "Pemove pop-in from DOM"
            }, {
                    "name": "setVAlign",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.ColumnListItem",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "since": "1.20",
                    "parameters": [{
                        "name": "sVAlign",
                        "type": "sap.ui.core.VerticalAlign",
                        "optional": false,
                        "description": "New value for property <code>vAlign</code>"
                }],
                    "description": "Sets a new value for property {@link #getVAlign vAlign}.\n\nSets the vertical alignment of all the cells within the table row (including selection and navigation). <b>Note:</b> <code>vAlign</code> property of <code>sap.m.Column</code> overrides the property for cell vertical alignment if both are set.\n\nWhen called with a value of <code>null</code> or <code>undefined</code>, the default value of the property will be restored.\n\nDefault value is <code>Inherit</code>."
            }, {
                    "name": "unbindCells",
                    "visibility": "public",
                    "returnValue": {
                        "type": "sap.m.ColumnListItem",
                        "description": "Reference to <code>this</code> in order to allow method chaining"
                    },
                    "description": "Unbinds aggregation {@link #getCells cells} from model data."
            }],
                "apiDocUrl": "https://openui5.hana.ondemand.com/#/api/sap.m.ColumnListItem"
        },
            {
                "kind": "namespace",
                "name": "sap.ui",
                "basename": "ui",
                "resource": "sap/ui/Global.js",
                "module": "sap/ui/Global",
                "static": true,
                "visibility": "public",
                "description": "The <code>sap.ui</code> namespace is the central OpenAjax compliant entry point for UI related JavaScript functionality provided by SAP.",
                "properties": [{
                    "name": "define",
                    "module": "ui5loader",
                    "visibility": "public",
                    "static": true,
                    "since": "1.27.0",
                    "type": "undefined",
                    "description": "Defines a Javascript module with its name, its dependencies and a module value or factory.\n\nThe typical and only suggested usage of this method is to have one single, top level call to <code>sap.ui.define</code> in one Javascript resource (file). When a module is requested by its name for the first time, the corresponding resource is determined from the name and the current {@link jQuery.sap.registerResourcePath configuration}. The resource will be loaded and executed which in turn will execute the top level <code>sap.ui.define</code> call.\n\nIf the module name was omitted from that call, it will be substituted by the name that was used to request the module. As a preparation step, the dependencies as well as their transitive dependencies, will be loaded. Then, the module value will be determined: if a static value (object, literal) was given as <code>vFactory</code>, that value will be the module value. If a function was given, that function will be called (providing the module values of the declared dependencies as parameters to the function) and its return value will be used as module value. The framework internally associates the resulting value with the module name and provides it to the original requester of the module. Whenever the module is requested again, the same value will be returned (modules are executed only once).\n\n<i>Example:</i><br> The following example defines a module \"SomeClass\", but doesn't hard code the module name. If stored in a file 'sap/mylib/SomeClass.js', it can be requested as 'sap/mylib/SomeClass'. <pre>\n  sap.ui.define(['./Helper', 'sap/m/Bar'], function(Helper,Bar) {\n\n    // create a new class\n    var SomeClass = function() {};\n\n    // add methods to its prototype\n    SomeClass.prototype.foo = function() {\n\n        // use a function from the dependency 'Helper' in the same package (e.g. 'sap/mylib/Helper' )\n        var mSettings = Helper.foo();\n\n        // create and return an sap.m.Bar (using its local name 'Bar')\n        return new Bar(mSettings);\n\n    }\n\n    // return the class as module value\n    return SomeClass;\n\n  });\n</pre>\n\nIn another module or in an application HTML page, the {@link sap.ui.require} API can be used to load the Something module and to work with it:\n\n<pre>\nsap.ui.require(['sap/mylib/Something'], function(Something) {\n\n  // instantiate a Something and call foo() on it\n  new Something().foo();\n\n});\n</pre>\n\n<h3>Module Name Syntax</h3>\n\n<code>sap.ui.define</code> uses a simplified variant of the {@link jQuery.sap.getResourcePath unified resource name} syntax for the module's own name as well as for its dependencies. The only difference to that syntax is, that for <code>sap.ui.define</code> and <code>sap.ui.require</code>, the extension (which always would be '.js') has to be omitted. Both methods always add this extension internally.\n\nAs a convenience, the name of a dependency can start with the segment './' which will be replaced by the name of the package that contains the currently defined module (relative name).\n\nIt is best practice to omit the name of the defined module (first parameter) and to use relative names for the dependencies whenever possible. This reduces the necessary configuration, simplifies renaming of packages and allows to map them to a different namespace.\n\n<h3>Dependency to Modules</h3>\n\nIf a dependencies array is given, each entry represents the name of another module that the currently defined module depends on. All dependency modules are loaded before the value of the currently defined module is determined. The module value of each dependency module will be provided as a parameter to a factory function, the order of the parameters will match the order of the modules in the dependencies array.\n\n<b>Note:</b> the order in which the dependency modules are <i>executed</i> is <b>not</b> defined by the order in the dependencies array! The execution order is affected by dependencies <i>between</i> the dependency modules as well as by their current state (whether a module already has been loaded or not). Neither module implementations nor dependents that require a module set must make any assumption about the execution order (other than expressed by their dependencies). There is, however, one exception with regard to third party libraries, see the list of limitations further down below.\n\n<b>Note:</b>a static module value (a literal provided to <code>sap.ui.define</code>) cannot depend on the module values of the dependency modules. Instead, modules can use a factory function, calculate the static value in that function, potentially based on the dependencies, and return the result as module value. The same approach must be taken when the module value is supposed to be a function.\n\n<h3>Asynchronous Contract</h3> <code>sap.ui.define</code> is designed to support real Asynchronous Module Definitions (AMD) in future, although it internally still uses the old synchronous module loading of UI5. Callers of <code>sap.ui.define</code> therefore must not rely on any synchronous behavior that they might observe with the current implementation.\n\nFor example, callers of <code>sap.ui.define</code> must not use the module value immediately after invoking <code>sap.ui.define</code>:\n\n<pre>\n  // COUNTER EXAMPLE HOW __NOT__ TO DO IT\n\n  // define a class Something as AMD module\n  sap.ui.define('Something', [], function() {\n    var Something = function() {};\n    return Something;\n  });\n\n  // DON'T DO THAT!\n  // accessing the class _synchronously_ after sap.ui.define was called\n  new Something();\n</pre>\n\nApplications that need to ensure synchronous module definition or synchronous loading of dependencies <b>MUST</b> use the old {@link jQuery.sap.declare} and {@link jQuery.sap.require} APIs.\n\n<h3>(No) Global References</h3>\n\nTo be in line with AMD best practices, modules defined with <code>sap.ui.define</code> should not make any use of global variables if those variables are also available as module values. Instead, they should add dependencies to those modules and use the corresponding parameter of the factory function to access the module value.\n\nAs the current programming model and the documentation of UI5 heavily rely on global names, there will be a transition phase where UI5 enables AMD modules and local references to module values in parallel to the old global names. The fourth parameter of <code>sap.ui.define</code> has been added to support that transition phase. When this parameter is set to true, the framework provides two additional functionalities\n\n<ol> <li>Before the factory function is called, the existence of the global parent namespace for the current module is ensured</li> <li>The module value will be automatically exported under a global name which is derived from the name of the module</li> </ol>\n\nThe parameter lets the framework know whether any of those two operations is needed or not. In future versions of UI5, a central configuration option is planned to suppress those 'exports'.\n\n<h3>Third Party Modules</h3> Although third party modules don't use UI5 APIs, they still can be listed as dependencies in a <code>sap.ui.define</code> call. They will be requested and executed like UI5 modules, but their module value will be <code>undefined</code>.\n\nIf the currently defined module needs to access the module value of such a third party module, it can access the value via its global name (if the module supports such a usage).\n\nNote that UI5 temporarily deactivates an existing AMD loader while it executes third party modules known to support AMD. This sounds contradictorily at a first glance as UI5 wants to support AMD, but for now it is necessary to fully support UI5 applications that rely on global names for such modules.\n\nExample: <pre>\n  // module 'Something' wants to use third party library 'URI.js'\n  // It is packaged by UI5 as non-UI5-module 'sap/ui/thirdparty/URI'\n\n  sap.ui.define('Something', ['sap/ui/thirdparty/URI'], function(URIModuleValue) {\n\n    new URIModuleValue(); // fails as module value is undefined\n\n    //global URI // (optional) declare usage of global name so that static code checks don't complain\n    new URI(); // access to global name 'URI' works\n\n    ...\n  });\n</pre>\n\n<h3>Differences to Standard AMD</h3>\n\nThe current implementation of <code>sap.ui.define</code> differs from the AMD specification (https://github.com/amdjs/amdjs-api) or from concrete AMD loaders like <code>requireJS</code> in several aspects: <ul> <li>The name <code>sap.ui.define</code> is different from the plain <code>define</code>. This has two reasons: first, it avoids the impression that <code>sap.ui.define</code> is an exact implementation of an AMD loader. And second, it allows the coexistence of an AMD loader (e.g. requireJS) and <code>sap.ui.define</code> in one application as long as UI5 or applications using UI5 are not fully prepared to run with an AMD loader. Note that the difference of the API names also implies that the UI5 loader can't be used to load 'real' AMD modules as they expect methods <code>define</code> and <code>require</code> to be available. Modules that use Unified Module Definition (UMD) syntax, can be loaded, but only when no AMD loader is present or when they expose their export also to the global namespace, even when an AMD loader is present (as e.g. jQuery does)</li> <li><code>sap.ui.define</code> currently loads modules with synchronous XHR calls. This is basically a tribute to the synchronous history of UI5. <b>BUT:</b> synchronous dependency loading and factory execution explicitly it not part of contract of <code>sap.ui.define</code>. To the contrary, it is already clear and planned that asynchronous loading will be implemented, at least as an alternative if not as the only implementation. Also check section <b>Asynchronous Contract</b> above.<br> Applications that need to ensure synchronous loading of dependencies <b>MUST</b> use the old {@link jQuery.sap.require} API.</li> <li><code>sap.ui.define</code> does not support plugins to use other file types, formats or protocols. It is not planned to support this in future</li> <li><code>sap.ui.define</code> does not support absolute URLs as module names (dependencies) nor does it allow module names that start with a slash. To refer to a module at an absolute URL, a resource root can be registered that points to that URL (or to a prefix of it).</li> <li><code>sap.ui.define</code> does <b>not</b> support the 'sugar' of requireJS where CommonJS style dependency declarations using <code>sap.ui.require(\"something\")</code> are automagically converted into <code>sap.ui.define</code> dependencies before executing the factory function.</li> </ul>\n\n<h3>Limitations, Design Considerations</h3> <ul> <li><b>Limitation</b>: as dependency management is not supported for Non-UI5 modules, the only way to ensure proper execution order for such modules currently is to rely on the order in the dependency array. Obviously, this only works as long as <code>sap.ui.define</code> uses synchronous loading. It will be enhanced when asynchronous loading is implemented.</li> <li>It was discussed to enforce asynchronous execution of the module factory function (e.g. with a timeout of 0). But this would have invalidated the current migration scenario where a sync <code>jQuery.sap.require</code> call can load a <code>sap.ui.define</code>'ed module. If the module definition would not execute synchronously, the synchronous contract of the require call would be broken (default behavior in existing UI5 applications)</li> <li>A single file must not contain multiple calls to <code>sap.ui.define</code>. Multiple calls currently are only supported in the so called 'preload' files that the UI5 merge tooling produces. The exact details of how this works might be changed in future implementations and are not yet part of the API contract</li> </ul>",
                    "experimental": {
                        "since": "1.27.0",
                        "text": "not all aspects of sap.ui.define are settled yet. If the documented constraints and limitations are obeyed, SAP-owned code might use it. If the fourth parameter is not used and if the asynchronous contract is respected, even Non-SAP code might use it."
                    },
                    "references": ["https://github.com/amdjs/amdjs-api"],
                    "resource": "ui5loader.js"
        }, {
                    "name": "require",
                    "module": "ui5loader",
                    "visibility": "public",
                    "static": true,
                    "type": "undefined",
                    "description": "Resolves one or more module dependencies.\n\n<b>Synchronous Retrieval of a Single Module Value</b>\n\nWhen called with a single string, that string is assumed to be the name of an already loaded module and the value of that module is returned. If the module has not been loaded yet, or if it is a Non-UI5 module (e.g. third party module), <code>undefined</code> is returned. This signature variant allows synchronous access to module values without initiating module loading.\n\nSample: <pre>\n  var JSONModel = sap.ui.require(\"sap/ui/model/json/JSONModel\");\n</pre>\n\nFor modules that are known to be UI5 modules, this signature variant can be used to check whether the module has been loaded.\n\n<b>Asynchronous Loading of Multiple Modules</b>\n\nIf an array of strings is given and (optionally) a callback function, then the strings are interpreted as module names and the corresponding modules (and their transitive dependencies) are loaded. Then the callback function will be called asynchronously. The module values of the specified modules will be provided as parameters to the callback function in the same order in which they appeared in the dependencies array.\n\nThe return value for the asynchronous use case is <code>undefined</code>.\n\n<pre>\n  sap.ui.require(['sap/ui/model/json/JSONModel', 'sap/ui/core/UIComponent'], function(JSONModel,UIComponent) {\n\n    var MyComponent = UIComponent.extend('MyComponent', {\n      ...\n    });\n    ...\n\n  });\n</pre>\n\nThis method uses the same variation of the {@link jQuery.sap.getResourcePath unified resource name} syntax that {@link sap.ui.define} uses: module names are specified without the implicit extension '.js'. Relative module names are not supported.",
                    "experimental": {
                        "since": "1.27.0",
                        "text": "not all aspects of sap.ui.require are settled yet. E.g. the return value of the asynchronous use case might change (currently it is undefined)."
                    },
                    "resource": "ui5loader.js"
        }],
                "methods": [{
                    "name": "component",
                    "module": "sap/ui/core/Component",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Component|Promise",
                        "description": "the Component instance or a Promise in case of asynchronous loading"
                    },
                    "since": "1.15.0",
                    "parameters": [{
                        "name": "vConfig",
                        "type": "string|object",
                        "optional": false,
                        "parameterProperties": {
                            "name": {
                                "name": "name",
                                "type": "string",
                                "optional": false,
                                "description": "Name of the Component to load, as a dot-separated name; Even when an alternate location is specified from which the manifest should be loaded (e.g. <code>vConfig.manifest</code> is set to a non-empty string), then the name specified in that manifest will be ignored and this name will be used instead to determine the module to be loaded."
                            },
                            "url": {
                                "name": "url",
                                "type": "string",
                                "optional": true,
                                "description": "Alternate location from where to load the Component. If a <code>manifestUrl</code> is given, this URL specifies the location of the final component defined via that manifest, otherwise it specifies the location of the component defined via its name <code>vConfig.name</code>."
                            },
                            "componentData": {
                                "name": "componentData",
                                "type": "object",
                                "optional": true,
                                "description": "Initial data of the Component (@see sap.ui.core.Component#getComponentData)"
                            },
                            "id": {
                                "name": "id",
                                "type": "string",
                                "optional": true,
                                "description": "sId of the new Component"
                            },
                            "settings": {
                                "name": "settings",
                                "type": "object",
                                "optional": true,
                                "description": "Settings of the new Component"
                            },
                            "async": {
                                "name": "async",
                                "type": "boolean",
                                "optional": true,
                                "description": "Indicates whether the Component creation should be done asynchronously; defaults to true when using the manifest property with a truthy value otherwise the default is false (experimental setting)"
                            },
                            "asyncHints": {
                                "name": "asyncHints",
                                "type": "object",
                                "optional": true,
                                "parameterProperties": {
                                    "libs": {
                                        "name": "libs",
                                        "type": "string[]",
                                        "optional": true,
                                        "description": "Libraries that should be (pre-)loaded before the Component (experimental setting)"
                                    },
                                    "components": {
                                        "name": "components",
                                        "type": "string[]",
                                        "optional": true,
                                        "description": "Components that should be (pre-)loaded before the Component (experimental setting)"
                                    },
                                    "waitFor": {
                                        "name": "waitFor",
                                        "type": "Promise|Promise[]",
                                        "optional": true,
                                        "description": "@since 1.37.0 a <code>Promise</code> or and array of <code>Promise</code>s for which the Component instantiation should wait (experimental setting)"
                                    }
                                },
                                "description": "Hints for the asynchronous loading (experimental setting)"
                            },
                            "manifest": {
                                "name": "manifest",
                                "type": "boolean|string|object",
                                "optional": true,
                                "description": "@since 1.49.0 Controls when and from where to load the manifest for the Component. When set to any truthy value, the manifest will be loaded asynchronously by default and evaluated before the Component controller, if it is set to a falsy value other than <code>undefined</code>, the manifest will be loaded after the controller. A non-empty string value will be interpreted as the URL location from where to load the manifest. A non-null object value will be interpreted as manifest content. Setting this property to a value other than <code>undefined</code>, completely deactivates the properties <code>manifestUrl</code> and <code>manifestFirst</code>, no matter what their values are."
                            },
                            "manifestUrl": {
                                "name": "manifestUrl",
                                "type": "string",
                                "optional": true,
                                "description": "@since 1.33.0 Specifies the URL from where the manifest should be loaded from Using this property implies <code>vConfig.manifestFirst=true</code>. <br/><b>DEPRECATED since 1.49.0, use <code>vConfig.manifest=url</code> instead!</b>. Note that this property is ignored when <code>vConfig.manifest</code> has a value other than <code>undefined</code>."
                            },
                            "manifestFirst": {
                                "name": "manifestFirst",
                                "type": "boolean",
                                "optional": true,
                                "description": "@since 1.33.0 defines whether the manifest is loaded before or after the Component controller. Defaults to <code>sap.ui.getCore().getConfiguration().getManifestFirst()</code> <br/><b>DEPRECATED since 1.49.0, use <code>vConfig.manifest=true|false</code> instead!</b> Note that this property is ignored when <code>vConfig.manifest</code> has a value other than <code>undefined</code>."
                            },
                            "handleValidation": {
                                "name": "handleValidation",
                                "type": "string",
                                "optional": true,
                                "defaultValue": false,
                                "description": "If set to <code>true</code> validation of the component is handled by the <code>MessageManager</code>"
                            }
                        },
                        "description": "ID of an existing Component or the configuration object to create the Component"
            }],
                    "description": "Creates a new instance of a <code>Component</code> or returns the instance of an existing <code>Component</code>.\n\nIf you want to look up an existing <code>Component</code> you can call this function with a Component ID as parameter: <pre>\n  var oComponent = sap.ui.component(sComponentId);\n</pre>\n\nTo create a new instance of a component you pass a component configuration object into this function: <pre>\n  var oComponent = sap.ui.component({\n    name: \"my.Component\",\n    url: \"my/component/location\",\n    id: \"myCompId1\"\n  });\n</pre>",
                    "experimental": {
                        "since": "1.27.0",
                        "text": "Support for asyncHints is still experimental and might be modified or removed completely again. It must not be used in productive code, except in code delivered by the UI5 teams. The synchronous usage of the API is not experimental and can be used without restrictions."
                    },
                    "resource": "sap/ui/core/Component.js"
        }, {
                    "name": "controller",
                    "module": "sap/ui/core/mvc/Controller",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "void|sap.ui.core.mvc.Controller|Promise",
                        "description": "void, the new controller instance or a Promise resolving with the controller in async case"
                    },
                    "parameters": [{
                        "name": "sName",
                        "type": "string",
                        "optional": false,
                        "description": "The controller name"
            }, {
                        "name": "oControllerImpl",
                        "type": "object",
                        "optional": true,
                        "description": "An object literal defining the methods and properties of the controller"
            }, {
                        "name": "bAsync",
                        "type": "boolean",
                        "optional": false,
                        "description": "Decides whether the controller gets loaded asynchronously or not"
            }],
                    "description": "Defines a controller class or creates an instance of an already defined controller class.\n\nWhen a name and a controller implementation object is given, a new controller class of the given name is created. The members of the implementation object will be copied into each new instance of that controller class (shallow copy). <b>Note</b>: as the members are shallow copied, controller instances will share all object values. This might or might not be what applications expect.\n\nIf only a name is given, a new instance of the named controller class is returned.",
                    "resource": "sap/ui/core/mvc/Controller.js"
        }, {
                    "name": "extensionpoint",
                    "module": "sap/ui/core/ExtensionPoint",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Control[]|Promise",
                        "description": "An array with 0..n controls created from an ExtensionPoint or if fnCreateDefaultContent is called and returns a Promise, a Promise with the controls is returned instead"
                    },
                    "parameters": [{
                        "name": "oContainer",
                        "type": "sap.ui.core.mvc.View|sap.ui.core.Fragment",
                        "optional": false,
                        "description": "The view or fragment containing the extension point"
            }, {
                        "name": "sExtName",
                        "type": "string",
                        "optional": false,
                        "description": "The extensionName used to identify the extension point in the customizing"
            }, {
                        "name": "fnCreateDefaultContent",
                        "type": "createDefaultContent",
                        "optional": true,
                        "description": "Optional callback function creating default content, returning an Array of controls. It is executed when there's no customizing, if not provided, no default content will be rendered."
            }, {
                        "name": "oTargetControl",
                        "type": "sap.ui.core.Control",
                        "optional": true,
                        "description": "Optional - use this parameter to attach the extension point to a particular aggregation"
            }, {
                        "name": "sAggregationName",
                        "type": "string",
                        "optional": true,
                        "description": "Optional - if provided along with oTargetControl, the extension point content is added to this particular aggregation at oTargetControl, if not given, but an oTargetControl is still present, the function will attempt to add the extension point to the default aggregation of oTargetControl. If no oTargetControl is provided, sAggregationName will also be ignored."
            }],
                    "description": "Creates 0..n UI5 controls from an ExtensionPoint. One control if the ExtensionPoint is e.g. filled with a View, zero for ExtensionPoints without configured extension and n controls for multi-root Fragments as extension.\n\nIn JSViews, this function allows both JSON notation in aggregation content as well as adding an extension point to an aggregation after the target control has already been instantiated. In the latter case the optional parameters oTargetControls and oTargetAggregation need to be specified.",
                    "resource": "sap/ui/core/ExtensionPoint.js"
        }, {
                    "name": "fragment",
                    "module": "sap/ui/core/Fragment",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Control|sap.ui.core.Control[]",
                        "description": "the root Control(s) of the Fragment content"
                    },
                    "parameters": [{
                        "name": "sName",
                        "type": "string",
                        "optional": false,
                        "description": "the Fragment name"
            }, {
                        "name": "sType",
                        "type": "string",
                        "optional": false,
                        "description": "the Fragment type, e.g. \"XML\", \"JS\", or \"HTML\""
            }, {
                        "name": "oController",
                        "type": "sap.ui.core.mvc.Controller",
                        "optional": true,
                        "description": "the Controller which should be used by the controls in the Fragment. Note that some Fragments may not need a Controller and other may need one - and even rely on certain methods implemented in the Controller."
            }],
                    "description": "Instantiate a Fragment - this method loads the Fragment content, instantiates it, and returns this content. The Fragment object itself is not an entity which has further significance beyond this constructor.\n\nTo instantiate an existing Fragment, call this method as: sap.ui.fragment(sName, sType, [oController]); The sName must correspond to an XML Fragment which can be loaded via the module system (fragmentName + suffix \".fragment.[typeextension]\") and which defines the Fragment content. If oController is given, the (event handler) methods referenced in the Fragment will be called on this controller. Note that Fragments may require a Controller to be given and certain methods to be available.\n\nThe Fragment types \"XML\", \"JS\" and \"HTML\" are available by default; additional Fragment types can be implemented and added using the sap.ui.core.Fragment.registerType() function.\n\nAdvanced usage: To instantiate a Fragment and give further configuration options, call this method as: sap.ui.fragment(oFragmentConfig, [oController]); The oFragmentConfig object can have the following properties: - \"fragmentName\": the name of the Fragment, as above - \"fragmentContent\": the definition of the Fragment content itself. When this property is given, any given name is ignored. The type of this property depends on the Fragment type, e.g. it could be a string for XML Fragments. - \"type\": the type of the Fragment, as above (mandatory) - \"id\": the ID of the Fragment (optional) Further properties may be supported by future or custom Fragment types. Any given properties will be forwarded to the Fragment implementation.\n\nIf you want to give a fixed ID for the Fragment, please use the advanced version of this method call with the configuration object or use the typed factories like sap.ui.xmlfragment(...) or sap.ui.jsfragment(...). Otherwise the Fragment ID is generated. In any case, the Fragment ID will be used as prefix for the ID of all contained controls.",
                    "resource": "sap/ui/core/Fragment.js"
        }, {
                    "name": "getCore",
                    "module": "sap/ui/core/Core",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Core",
                        "description": "the API of the current SAPUI5 Core instance."
                    },
                    "description": "Retrieve the {@link sap.ui.core.Core SAPUI5 Core} instance for the current window.",
                    "resource": "sap/ui/core/Core.js"
        }, {
                    "name": "getVersionInfo",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "object|undefined|Promise",
                        "description": "the full version info, the library specific one, undefined (if library is not listed or there was an error and \"failOnError\" is set to \"false\") or a Promise which resolves with one of them"
                    },
                    "parameters": [{
                        "name": "mOptions",
                        "type": "string|object",
                        "optional": true,
                        "parameterProperties": {
                            "library": {
                                "name": "library",
                                "type": "boolean",
                                "optional": true,
                                "description": "name of the library (e.g. \"sap.ui.core\")"
                            },
                            "async": {
                                "name": "async",
                                "type": "boolean",
                                "optional": true,
                                "defaultValue": false,
                                "description": "whether \"sap-ui-version.json\" should be loaded asynchronously"
                            },
                            "failOnError": {
                                "name": "failOnError",
                                "type": "boolean",
                                "optional": true,
                                "defaultValue": true,
                                "description": "whether to propagate load errors or not (not relevant for async loading)"
                            }
                        },
                        "description": "name of the library (e.g. \"sap.ui.core\") or an object map (see below)"
            }],
                    "description": "Loads the version info file (resources/sap-ui-version.json) and returns it or if a library name is specified then the version info of the individual library will be returned.\n\nIn case of the version info file is not available an error will occur when calling this function."
        }, {
                    "name": "htmlfragment",
                    "module": "sap/ui/core/Fragment",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Control|sap.ui.core.Control[]",
                        "description": "the root Control(s) of the created Fragment instance"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created Fragment"
            }, {
                        "name": "vFragment",
                        "type": "string|object",
                        "optional": false,
                        "description": "name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. Instead give the id inside the config object, if desired.)"
            }, {
                        "name": "oController",
                        "type": "sap.ui.core.mvc.Controller",
                        "optional": true,
                        "description": "a Controller to be used for event handlers in the Fragment"
            }],
                    "description": "Instantiates an HTML-based Fragment.\n\nTo instantiate a Fragment, call this method as: sap.ui.htmlfragment([sId], sFragmentName, [oController]); The Fragment instance ID is optional and will be used as prefix for the ID of all contained controls. If no ID is passed, controls will not be prefixed. The sFragmentName must correspond to an HTML Fragment which can be loaded via the module system (fragmentName + \".fragment.html\") and which defines the Fragment. If oController is given, the methods referenced in the Fragment will be called on this controller. Note that Fragments may require a Controller to be given and certain methods to be available.\n\nAdvanced usage: To instantiate a Fragment and optionally directly give the HTML definition instead of loading it from a file, call this method as: sap.ui.htmlfragment(oFragmentConfig, [oController]); The oFragmentConfig object can either have a \"fragmentName\" or a \"fragmentContent\" property. fragmentContent is optional and can hold the Fragment definition as XML string; if not given, fragmentName must be given and the Fragment content definition is loaded by the module system. Again, if oController is given, the methods referenced in the Fragment will be called on this controller.",
                    "resource": "sap/ui/core/Fragment.js"
        }, {
                    "name": "htmlview",
                    "module": "sap/ui/core/mvc/HTMLView",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.mvc.HTMLView|undefined",
                        "description": "the created HTMLView instance in the creation case, otherwise undefined"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created view, only allowed for instance creation"
            }, {
                        "name": "vView",
                        "type": "string|object",
                        "optional": false,
                        "parameterProperties": {
                            "async": {
                                "name": "async",
                                "type": "boolean",
                                "optional": true,
                                "description": "defines how the view source is loaded and rendered later on"
                            }
                        },
                        "description": "name or implementation of the view."
            }],
                    "description": "Defines or creates an instance of a declarative HTML view.\n\nThe behavior of this method depends on the signature of the call and on the current context.\n\n<ul> <li>View Definition <code>sap.ui.htmlview(sId, vView)</code>: Defines a view of the given name with the given implementation. sId must be the views name, vView must be an object and can contain implementations for any of the hooks provided by HTMLView</li> <li>View Instantiation <code>sap.ui.htmlview(sId?, vView)</code>: Creates an instance of the view with the given name (and id)</li>. </ul>\n\nAny other call signature will lead to a runtime error. If the id is omitted in the second variant, an id will be created automatically.",
                    "resource": "sap/ui/core/mvc/HTMLView.js"
        }, {
                    "name": "jsfragment",
                    "module": "sap/ui/core/Fragment",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Control|sap.ui.core.Control[]",
                        "description": "the root Control(s) of the created Fragment instance"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created Fragment"
            }, {
                        "name": "sFragmentName",
                        "type": "string|object",
                        "optional": false,
                        "description": "name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. Instead give the id inside the config object, if desired)"
            }, {
                        "name": "oController",
                        "type": "sap.ui.core.mvc.Controller",
                        "optional": true,
                        "description": "a Controller to be used for event handlers in the Fragment"
            }],
                    "description": "Defines OR instantiates an HTML-based Fragment.\n\nTo define a JS Fragment, call this method as: sap.ui.jsfragment(sName, oFragmentDefinition) Where: - \"sName\" is the name by which this fragment can be found and instantiated. If defined in its own file, in order to be found by the module loading system, the file location and name must correspond to sName (path + file name must be: fragmentName + \".fragment.js\"). - \"oFragmentDefinition\" is an object at least holding the \"createContent(oController)\" method which defines the Fragment content. If given during instantiation, the createContent method receives a Controller instance (otherwise oController is undefined) and the return value must be one sap.ui.core.Control (which could have any number of children).\n\nTo instantiate a JS Fragment, call this method as: sap.ui.jsfragment([sId], sFragmentName, [oController]); The Fragment ID is optional (generated if not given) and the Fragment implementation CAN use it to make contained controls unique (this depends on the implementation: some JS Fragments may choose not to support multiple instances within one application and not use the ID prefixing). The sFragmentName must correspond to a JS Fragment which can be loaded via the module system (fragmentName + \".fragment.js\") and which defines the Fragment. If oController is given, the methods referenced in the Fragment will be called on this controller. Note that Fragments may require a Controller to be given and certain methods to be available.",
                    "resource": "sap/ui/core/Fragment.js"
        }, {
                    "name": "jsonview",
                    "module": "sap/ui/core/mvc/JSONView",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.mvc.JSONView",
                        "description": "the created JSONView instance"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created view"
            }, {
                        "name": "vView",
                        "type": "string|object",
                        "optional": false,
                        "parameterProperties": {
                            "viewName": {
                                "name": "viewName",
                                "type": "string",
                                "optional": true,
                                "description": "name of a view resource in module name notation (without suffix)"
                            },
                            "viewContent": {
                                "name": "viewContent",
                                "type": "string|object",
                                "optional": true,
                                "description": "view definition as a JSON string or an object literal"
                            },
                            "async": {
                                "name": "async",
                                "type": "boolean",
                                "optional": true,
                                "description": "defines how the view source is loaded and rendered later on"
                            },
                            "controller": {
                                "name": "controller",
                                "type": "sap.ui.core.mvc.Controller",
                                "optional": true,
                                "description": "controller to be used for this view instance"
                            }
                        },
                        "description": "name of a view resource or view configuration as described above."
            }],
                    "description": "Creates a JSON view of the given name and id.\n\nThe <code>viewName</code> must either correspond to a JSON module that can be loaded via the module system (viewName + suffix \".view.json\") and which defines the view or it must be a configuration object for a view. The configuration object can have a viewName, viewContent and a controller property. The viewName behaves as described above, viewContent can hold the view description as JSON string or as object literal.\n\n<strong>Note</strong>: when an object literal is given, it might be modified during view construction.\n\nThe controller property can hold a controller instance. If a controller instance is given, it overrides the controller defined in the view.\n\nLike with any other control, an id is optional and will be created when missing.",
                    "resource": "sap/ui/core/mvc/JSONView.js"
        }, {
                    "name": "jsview",
                    "module": "sap/ui/core/mvc/JSView",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.mvc.JSView|undefined",
                        "description": "the created JSView instance in the creation case, otherwise undefined"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created view, only allowed for instance creation"
            }, {
                        "name": "vView",
                        "type": "string|object",
                        "optional": false,
                        "description": "name or implementation of the view."
            }, {
                        "name": "bAsync",
                        "type": "boolean",
                        "optional": true,
                        "description": "defines how the view source is loaded and rendered later on (only relevant for instantiation, ignored for everything else)"
            }],
                    "description": "Defines or creates an instance of a JavaScript view.\n\nThe behavior of this method depends on the signature of the call and on the current context.\n\n<h3>View Definition</h3> <pre>\n  sap.ui.jsview(sId, vView);\n</pre> Defines a view of the given name with the given implementation. <code>sId</code> must be the view's name, <code>vView</code> must be an object and can contain implementations for any of the hooks provided by JSView.\n\n<h3>View Instantiation</h3> <pre>\n  var oView = sap.ui.jsview(vView);\n  var oView = sap.ui.jsview(vView, bASync);\n  var oView = sap.ui.jsview(sId, vView);\n  var oView = sap.ui.jsview(sId, vView, bAsync);\n</pre> Creates an instance of the view with the given name (and id). If no view implementation has been defined for that view name, a JavaScript module with the same qualified name and with suffix <code>.view.js</code> will be loaded (required) and executed. The module should register a view definition on execution (1st. variant above).\n\nIf <code>sId</code> is omitted, an ID will be created automatically.\n\nWhen <code>bAsync</code> has a truthy value, the view definition will be read asynchronously, if needed, but the (incomplete) view instance will be returned immediately.\n\n<b>Note:</b> Any other call signature will lead to a runtime error.",
                    "resource": "sap/ui/core/mvc/JSView.js"
        }, {
                    "name": "lazyRequire",
                    "visibility": "public",
                    "static": true,
                    "parameters": [{
                        "name": "sClassName",
                        "type": "string",
                        "optional": false,
                        "description": "Fully qualified name (dot notation) of the class that should be prepared"
            }, {
                        "name": "sMethods",
                        "type": "string",
                        "optional": true,
                        "defaultValue": "'new'",
                        "description": "space separated list of additional (static) methods that should be created as stubs"
            }, {
                        "name": "sModuleName",
                        "type": "string",
                        "optional": true,
                        "description": "name of the module to load, defaults to the class name"
            }],
                    "description": "Creates a lazy loading stub for a given class <code>sClassName</code>.\n\nIf the class has been loaded already, nothing is done. Otherwise a stub object or constructor and - optionally - a set of stub methods are created. All created stubs will load the corresponding module on execution and then delegate to their counterpart in the loaded module.\n\nWhen no methods are given or when the list of methods contains the special name \"new\" (which is an operator can't be used as method name in JavaScript), then a stub <b>constructor</b> for class <code>sClassName</code> is created. Otherwise, a plain object is created.\n\n<b>Note</b>: Accessing any stub as a plain object without executing it (no matter whether it is a function or an object) won't load the module and therefore most like won't work as expected. This is a fundamental restriction of the lazy loader approach. It could only be fixed with JavaScript 1.5 features that are not available in all UI5 target browsers (e.g. not in IE8).\n\n<b>Note</b>: As a side effect of this method, the namespace containing the given class is created <b>immediately</b>."
        }, {
                    "name": "localResources",
                    "visibility": "public",
                    "static": true,
                    "parameters": [{
                        "name": "sNamespace",
                        "type": "string",
                        "optional": false,
                        "description": "Namespace prefix for which to load resources relative to the application root folder"
            }],
                    "description": "Redirects access to resources that are part of the given namespace to a location relative to the assumed <b>application root folder</b>.\n\nAny UI5 managed resource (view, controller, control, JavaScript module, CSS file, etc.) whose resource name starts with <code>sNamespace</code>, will be loaded from an equally named subfolder of the <b>application root folder</b>. If the resource name consists of multiple segments (separated by a dot), each segment is assumed to represent an individual folder. In other words: when a resource name is converted to a URL, any dots ('.') are converted to slashes ('/').\n\n<b>Limitation:</b> For the time being, the <b>application root folder</b> is assumed to be the same as the folder where the current page resides in.\n\nUsage sample: <pre>\n  // Let UI5 know that resources, whose name starts with \"com.mycompany.myapp\"\n  // should be loaded from the URL location \"./com/mycompany/myapp\"\n  sap.ui.localResources(\"com.mycompany.myapp\");\n\n  // The following call implicitly will use the mapping done by the previous line\n  // It will load a view from ./com/mycompany/myapp/views/Main.view.xml\n  sap.ui.view({ view : \"com.mycompany.myapp.views.Main\", type : sap.ui.core.mvc.ViewType.XML});\n</pre>\n\nWhen applications need a more flexible mapping between resource names and their location, they can use {@link jQuery.sap.registerModulePath}.\n\nIt is intended to make this configuration obsolete in future releases, but for the time being, applications must call this method when they want to store resources relative to the assumed application root folder.",
                    "references": ["jQuery.sap.registerModulePath"]
        }, {
                    "name": "namespace",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "object",
                        "description": "the innermost namespace of the hierarchy"
                    },
                    "parameters": [{
                        "name": "sNamespace",
                        "type": "string",
                        "optional": false
            }],
                    "description": "Ensures that a given a namespace or hierarchy of nested namespaces exists in the current <code>window</code>.",
                    "deprecated": {
                        "text": "Use jQuery.sap.declare or jQuery.sap.getObject(...,0) instead"
                    }
        }, {
                    "name": "resource",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "string",
                        "description": "the URL of the requested resource"
                    },
                    "parameters": [{
                        "name": "sLibraryName",
                        "type": "string",
                        "optional": false,
                        "description": "the name of a library, like \"sap.ui.commons\""
            }, {
                        "name": "sResourcePath",
                        "type": "string",
                        "optional": false,
                        "description": "the relative path of a resource inside this library, like \"img/mypic.png\" or \"themes/my_theme/img/mypic.png\""
            }],
                    "description": "Returns the URL of a resource that belongs to the given library and has the given relative location within the library. This is mainly meant for static resources like images that are inside the library. It is NOT meant for access to JavaScript modules or anything for which a different URL has been registered with jQuery.sap.registerModulePath(). For these cases use jQuery.sap.getModulePath(). It DOES work, however, when the given sResourcePath starts with \"themes/\" (= when it is a theme-dependent resource). Even when for this theme a different location outside the normal library location is configured."
        }, {
                    "name": "setRoot",
                    "module": "sap/ui/core/Core",
                    "visibility": "public",
                    "static": true,
                    "parameters": [{
                        "name": "oDomRef",
                        "type": "string|Element|sap.ui.core.Control",
                        "optional": false,
                        "description": "a DOM Element or Id String of the UIArea"
            }, {
                        "name": "oControl",
                        "type": "sap.ui.base.Interface|sap.ui.core.Control",
                        "optional": false,
                        "description": "the Control that should be added to the <code>UIArea</code>."
            }],
                    "description": "Displays the control tree with the given root inside the area of the given DOM reference (or inside the DOM node with the given ID) or in the given Control.\n\nExample: <pre>\n  &lt;div id=\"SAPUI5UiArea\">&lt;/div>\n  &lt;script>\n    var oRoot = new sap.ui.commons.Label();\n    oRoot.setText(\"Hello world!\");\n    sap.ui.setRoot(\"SAPUI5UiArea\", oRoot);\n  &lt;/script>\n</pre> <p>\n\nThis is a shortcut for <code>sap.ui.getCore().setRoot()</code>.\n\nInternally, if a string is given that does not identify a UIArea or a control then implicitly a new <code>UIArea</code> is created for the given DOM reference and the given control is added.",
                    "deprecated": {
                        "text": "Use function <code>placeAt</code> of <code>sap.ui.core.Control</code> instead."
                    },
                    "resource": "sap/ui/core/Core.js"
        }, {
                    "name": "template",
                    "module": "sap/ui/core/tmpl/Template",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.tmpl.Template|sap.ui.core.tmpl.Template[]",
                        "description": "the created Template instance or in case of usage without parameters any array of templates is returned"
                    },
                    "parameters": [{
                        "name": "oTemplate",
                        "type": "string|DomRef|object",
                        "optional": true,
                        "parameterProperties": {
                            "id": {
                                "name": "id",
                                "type": "string",
                                "optional": false,
                                "description": "the ID of the Template / the ID of the DOM element containing the source of the Template</li>"
                            },
                            "domref": {
                                "name": "domref",
                                "type": "Element",
                                "optional": false,
                                "description": "the DOM element containing the source of the Template</li>"
                            },
                            "type": {
                                "name": "type",
                                "type": "string",
                                "optional": true,
                                "description": "the type of the Template</li>"
                            },
                            "src": {
                                "name": "src",
                                "type": "string",
                                "optional": true,
                                "description": "the URL to lookup the template</li> (<i>experimental!</i>)"
                            },
                            "control": {
                                "name": "control",
                                "type": "string",
                                "optional": false,
                                "description": "the fully qualified name of the control to declare</li> (<i>experimental!</i>)"
                            }
                        },
                        "description": "the ID or the DOM reference to the template to lookup or a configuration object containing the src, type and eventually the ID of the Template."
            }],
                    "description": "Creates a Template for the given ID, DOM reference or a configuration object.\n\nIf no parameter is defined, this function makes a lookup of DOM elements which are specifying a type attribute. If the value of this type attribute matches a registered type then the content of this DOM element will be used to create a new <code>Template</code> instance.\n\nIf you want to lookup all kind of existing and known templates and parse them directly you can simply call: <pre>\n  sap.ui.template();\n</pre>\n\nTo parse a concrete DOM element you can do so by using this function in the following way: <pre>\n  sap.ui.template(\"theTemplateId\");\n</pre>\n\nOr you can pass the reference to a DOM element and use this DOM element as a source for the template: <pre>\n  sap.ui.template(oDomRef);\n</pre>\n\nThe last option to use this function is to pass the information via a configuration object. This configuration object can be used to pass a context for the templating framework when compiling the template: <pre>\n  var oTemplateById = sap.ui.template({\n    id: \"theTemplateId\",\n    context: { ... }\n  });\n\n  var oTemplateByDomRef = sap.ui.template({\n    domref: oDomRef,\n    context: { ... }\n  });\n</pre>\n\nIt can also be used to load a template from another file: <pre>\n  var oTemplate = sap.ui.template({\n    id: \"myTemplate\",\n    src: \"myTemplate.tmpl\"\n  });\n\n  var oTemplateWithContext = sap.ui.template({\n    id: \"myTemplate\",\n    src: \"myTemplate.tmpl\",\n    context: { ... }\n  });\n</pre>",
                    "resource": "sap/ui/core/tmpl/Template.js"
        }, {
                    "name": "templateview",
                    "module": "sap/ui/core/mvc/TemplateView",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.mvc.TemplateView|undefined",
                        "description": "the created TemplateView instance in the creation case, otherwise undefined"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created view, only allowed for instance creation"
            }, {
                        "name": "vView",
                        "type": "string|object",
                        "optional": false,
                        "description": "name or implementation of the view."
            }],
                    "description": "Defines or creates an instance of a template view.\n\nThe behavior of this method depends on the signature of the call and on the current context.\n\n<ul> <li>View Definition <code>sap.ui.templateview(sId, vView)</code>: Defines a view of the given name with the given implementation. sId must be the views name, vView must be an object and can contain implementations for any of the hooks provided by templateview</li> <li>View Instantiation <code>sap.ui.templateview(sId?, vView)</code>: Creates an instance of the view with the given name (and id)</li>. </ul>\n\nAny other call signature will lead to a runtime error. If the id is omitted in the second variant, an id will be created automatically.",
                    "resource": "sap/ui/core/mvc/TemplateView.js"
        }, {
                    "name": "view",
                    "module": "sap/ui/core/mvc/View",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.mvc.View",
                        "description": "the created View instance"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": false,
                        "description": "id of the newly created view, only allowed for instance creation"
            }, {
                        "name": "vView",
                        "type": "string|object",
                        "optional": true,
                        "parameterProperties": {
                            "async": {
                                "name": "async",
                                "type": "boolean",
                                "optional": true,
                                "description": "defines how the view source is loaded and rendered later on"
                            }
                        },
                        "description": "the view name or view configuration object"
            }],
                    "description": "Creates a view of the given type, name and with the given id.\n\nThe <code>vView</code> configuration object can have the following properties for the view instantiation: <ul> <li>The ID <code>vView.id</code> specifies an ID for the View instance. If no ID is given, an ID will be generated.</li> <li>The view name <code>vView.viewName</code> corresponds to an XML module that can be loaded via the module system (vView.viewName + suffix \".view.xml\")</li> <li>The controller instance <code>vView.controller</code> must be a valid controller implementation. The given controller instance overrides the controller defined in the view definition</li> <li>The view type <code>vView.type</code> specifies what kind of view will be instantiated. All valid view types are listed in the enumeration sap.ui.core.mvc.ViewType.</li> <li>The view data <code>vView.viewData</code> can hold user specific data. This data is available during the whole lifecycle of the view and the controller</li> <li>The view loading mode <code>vView.async</code> must be a boolean and defines if the view source is loaded synchronously or asynchronously. In async mode, the view is rendered empty initially, and re-rendered with the loaded view content.</li> <li><code>vView.preprocessors</code></li> can hold a map from the specified preprocessor type (e.g. \"xml\") to an array of preprocessor configurations; each configuration consists of a <code>preprocessor</code> property (optional when registered as on-demand preprocessor) and may contain further preprocessor-specific settings. The preprocessor can be either a module name as string implementation of {@link sap.ui.core.mvc.View.Preprocessor} or a function according to {@link sap.ui.core.mvc.View.Preprocessor.process}. Do not set properties starting with underscore like <code>_sProperty</code> property, these are reserved for internal purposes. When several preprocessors are provided for one hook, it has to be made sure that they do not conflict when being processed serially.\n\n<strong>Note</strong>: These preprocessors are only available to this instance. For global or on-demand availability use {@link sap.ui.core.mvc.XMLView.registerPreprocessor}.\n\n<strong>Note</strong>: Please note that preprocessors in general are currently only available to XMLViews.\n\n<strong>Note</strong>: Preprocessors only work in async views and will be ignored when the view is instantiated in sync mode by default, as this could have unexpected side effects. You may override this behaviour by setting the bSyncSupport flag of the preprocessor to true.",
                    "resource": "sap/ui/core/mvc/View.js"
        }, {
                    "name": "xmlfragment",
                    "module": "sap/ui/core/Fragment",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.Control|sap.ui.core.Control[]",
                        "description": "the root Control(s) of the created Fragment instance"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "id of the newly created Fragment"
            }, {
                        "name": "vFragment",
                        "type": "string|object",
                        "optional": false,
                        "description": "name of the Fragment (or Fragment configuration as described above, in this case no sId may be given. Instead give the id inside the config object, if desired)"
            }, {
                        "name": "oController",
                        "type": "sap.ui.core.mvc.Controller",
                        "optional": true,
                        "description": "a Controller to be used for event handlers in the Fragment"
            }],
                    "description": "Instantiates an XML-based Fragment.\n\nTo instantiate a Fragment, call this method as: sap.ui.xmlfragment([sId], sFragmentName, [oController]); The Fragment instance ID is optional and will be used as prefix for the ID of all contained controls. If no ID is passed, controls will not be prefixed. The sFragmentName must correspond to an XML Fragment which can be loaded via the module system (fragmentName + \".fragment.xml\") and which defines the Fragment. If oController is given, the methods referenced in the Fragment will be called on this controller. Note that Fragments may require a Controller to be given and certain methods to be available.\n\nAdvanced usage: To instantiate a Fragment and optionally directly give the XML definition instead of loading it from a file, call this method as: sap.ui.xmlfragment(oFragmentConfig, [oController]); The oFragmentConfig object can either have a \"fragmentName\" or a \"fragmentContent\" property. fragmentContent is optional and can hold the Fragment definition as XML string; if not given, fragmentName must be given and the Fragment content definition is loaded by the module system. Again, if oController is given, the methods referenced in the Fragment will be called on this controller.",
                    "resource": "sap/ui/core/Fragment.js"
        }, {
                    "name": "xmlview",
                    "module": "sap/ui/core/mvc/XMLView",
                    "visibility": "public",
                    "static": true,
                    "returnValue": {
                        "type": "sap.ui.core.mvc.XMLView",
                        "description": "the created XMLView instance"
                    },
                    "parameters": [{
                        "name": "sId",
                        "type": "string",
                        "optional": true,
                        "description": "ID of the newly created view"
            }, {
                        "name": "vView",
                        "type": "string|object",
                        "optional": false,
                        "parameterProperties": {
                            "viewName": {
                                "name": "viewName",
                                "type": "string",
                                "optional": true,
                                "description": "Name of the view resource in module name notation (without suffix)"
                            },
                            "viewContent": {
                                "name": "viewContent",
                                "type": "string|Document",
                                "optional": true,
                                "description": "XML string or XML document that defines the view"
                            },
                            "async": {
                                "name": "async",
                                "type": "boolean",
                                "optional": true,
                                "description": "Defines how the view source is loaded and rendered later on"
                            },
                            "cache": {
                                "name": "cache",
                                "type": "object",
                                "optional": true,
                                "parameterProperties": {
                                    "keys": {
                                        "name": "keys",
                                        "type": "Array.<string|Promise>",
                                        "optional": true,
                                        "description": "Array with strings or Promises resolving with strings"
                                    }
                                },
                                "description": "Cache configuration, only for <code>async</code> views; caching gets active when this object is provided with vView.cache.keys array; keys are used to store data in the cache and for invalidation of the cache"
                            },
                            "preprocessors": {
                                "name": "preprocessors",
                                "type": "object",
                                "optional": true,
                                "description": "Preprocessors configuration, see {@link sap.ui.core.mvc.View}"
                            },
                            "controller": {
                                "name": "controller",
                                "type": "sap.ui.core.mvc.Controller",
                                "optional": true,
                                "description": "Controller instance to be used for this view"
                            }
                        },
                        "description": "Name of the view or a view configuration object as described above"
            }],
                    "description": "Instantiates an XMLView of the given name and with the given ID.\n\nThe <code>viewName</code> must either correspond to an XML module that can be loaded via the module system (viewName + suffix \".view.xml\") and which defines the view, or it must be a configuration object for a view. The configuration object can have a <code>viewName</code>, <code>viewContent</code> and a <code>controller </code> property. The <code>viewName</code> behaves as described above. <code>viewContent</code> is optional and can hold a view description as XML string or as already parsed XML Document. If not given, the view content definition is loaded by the module system.\n\n<strong>Note</strong>: if a <code>Document</code> is given, it might be modified during view construction.\n\n<strong>Note:</strong><br> On root level, you can only define content for the default aggregation, e.g. without adding the <code>&lt;content&gt;</code> tag. If you want to specify content for another aggregation of a view like <code>dependents</code>, place it in a child control's dependents aggregation or add it by using {@link sap.ui.core.mvc.XMLView#addDependent}.\n\n<strong>Note</strong>: if you enable caching, you need to take care of the invalidation via keys. Automatic invalidation takes only place if the UI5 version or the component descriptor (manifest.json) change. This is still an experimental feature and may experience slight changes of the invalidation parameters or the cache key format.\n\nThe controller property can hold a controller instance. If a controller instance is given, it overrides the controller defined in the view.\n\nLike with any other control, ID is optional and one will be created automatically.",
                    "resource": "sap/ui/core/mvc/XMLView.js"
        }]
    }]
    };
});
