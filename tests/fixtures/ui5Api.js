define((require, exports) => {
    "use strict";

    exports.ui5Xml = `<?xml version="1.0" encoding="UTF-8" ?>
                    <index>
                    <namespace>
	                   <type>class</type>
	                   <alias>jQuery.Event</alias>
	                   <description>jQuery.Event</description>
	                   <name>Event</name>
	                   <ref>symbols/jQuery.Event.html</ref>
                    </namespace>

                    <namespace>
	                   <type>class</type>
	                   <alias>sap.m.Tree</alias>
	                   <description>sap.m.Tree</description>
	                   <name>Tree</name>
	                   <ref>symbols/sap.m.Tree.html</ref>
                    </namespace>

                    <namespace>
	                   <type>class</type>
	                   <alias>sap.m.ColumnListItem</alias>
	                   <description>sap.m.ColumnListItem</description>
	                   <name>ColumnListItem</name>
	                   <ref>symbols/sap.m.ColumnListItem.html</ref>
                    </namespace>

                    </index>`;

    exports.ui5ApiObjects = [{
        path: "jQuery.Event",
        name: "Event",
        deprecated: false,
        apiUrl: "https://openui5.hana.ondemand.com/#docs/api/symbols/jQuery.Event.html"
    }, {
        path: "sap.m.Tree",
        name: "Tree",
        deprecated: false,
        apiUrl: "https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.Tree.html"
    }, {
        path: "sap.m.ColumnListItem",
        name: "ColumnListItem",
        deprecated: false,
        apiUrl: "https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.ColumnListItem.html"
    }];

    exports.apiIndex = {
        "$schema-ref": "http://schemas.sap.com/sapui5/designtime/api.json/1.0",
        "version": "1.50.8",
        "library": "*",
        "symbols": [{
            "name": "jQuery.Event",
            "kind": "class",
            "visibility": "public",
            "lib": "sap.ui.core"
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
            "extends": "sap.m.ColumnListItem",
            "lib": "sap.m"
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
            "apiDocUrl": "https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.ColumnListItem.html"
        }]
    };

    exports.sapMTreeProcessedApi = {
        "apiDocUrl": "https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.Tree.html",
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
    };
});
