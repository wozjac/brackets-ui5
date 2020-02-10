[![Build Status](https://travis-ci.com/wozjac/brackets-ui5.svg?branch=master)](https://travis-ci.com/wozjac/brackets-ui5)

# Brackets UI5

1. [Intro](#info)
2. [Features summary](#features-summary)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Features details](#features)  
    5.1 [UI5 API reference panel](#ui5-api-reference-panel)  
    5.2 [Configurable code snippets](#configurable-code-snippets)  
    5.3 [oData mock data generator](#odata-mock-data-generator)  
    5.4 [Quick docs](#quick-docs)  
    5.5 [Quick edit](#quick-edit)  
    5.6 [Code hints](#code-hints-1)  
    5.7 [Code hints for UI5 objects](#code-hints-for-ui5-objects)  
    5.8 [Jump to definition](#jump-to-definition)  
6. [UI5 identifier type recognition in Javascript code](#ui5-identifier-type-recognition-in-javascript-code)
7. [Preferences](#preferences)
8. [Unit tests](#unit-tests)
9. [License](#license)
10. [Contributing](#contributing)
11. [Author](#author)
12. [Appendix A](#appendix-a)

![main](http://public_repo.vipserv.org/images/main.png)

## Info
An extension for [Brackets](http://brackets.io) editor providing helpers (quick docs, code hints, API reference and more) for SAP© UI5 library [OpenUI5](openui5.hana.ondemand.com)/[SAPUI5](https://sapui5.hana.ondemand.com).

Overview: https://blogs.sap.com/2019/08/06/ui5-in-brackets-editor/

**Please notice (if you are new to UI5)! [OpenUI5](https://openui5.org) is open source, but SAPUI5 - although SAP shares publicly SAPUI5 library runtime & SDK etc. - it is not free to use it. Please check the company [site](https://sap.com) for more details.**

## Features summary
Please check "Feature details" section for detailed information & working cases.  
- UI5 API reference panel
- configurable code snippets
- mock data generation for oData services

### Brackets-specific features adjusted to work with UI5:
##### Quick docs [ctrl+k] 
- available in JS code and XML views

##### Quick edit [ctrl+e]
In XML views: 
- controller functions in attributes (complex syntax not supported yet)
- i18n keys

##### Code hints
XML views
- tags and attributes
- i18n keys for i18n model bindings

Javascript files:
- UI5 pubic methods and properties

##### Jump to definition [ctrl+j]
XML views:
- controller functions in attributes (complex syntax not supported yet)
- i18n keys

## Requirements
- Brackets version >= 1.14
- SAPUI5/OpenUI5 version configured in the plugin must be >= 1.52

## Installation
The extension is not yet added to the Bracket extensions repository. It can be installed using a downloaded ZIP file, extension's GitHub repository URL: https://github.com/wozjac/brackets-ui5 or ZIP file URL - check [releases](https://github.com/wozjac/brackets-ui5/releases).  
**If the extension fail to start just hit F5 (reload).**

![install](http://public_repo.vipserv.org/images/install.png)

After successful installation the *UI5 tools* menu should be available.

![menu](http://public_repo.vipserv.org/images/menu.png)

By default, the extension uses the OpenUI5 version 1.72.4. 
This can be changed using Brackets [preferences](#preferences). Create .brackets.json file in the project's root and set the required library version (>= 1.52.0): 
```javascript
{
    "bracketsUi5.apiUrl": "https://openui5.hana.ondemand.com/1.70.0"
}
```
Switching to SAPUI5:
```javascript
{
    "bracketsUi5.apiUrl": "https://sapui5.hana.ondemand.com/1.70.0"
}
```
**PLEASE NOTE: the most recent versions are usually not fully working:**: 
- schema files are not available
- not all API documentation is published  

Available versions can be checked here: [https://openui5.hana.ondemand.com/versionoverview.html](https://openui5.hana.ondemand.com/versionoverview.html), scroll down to the section "Available OpenUI5 Versions". For SAP UI5 please use [https://sapui5.hana.ondemand.com/versionoverview.html](https://sapui5.hana.ondemand.com/versionoverview.html).  

If something is not working please check the console (F12). Extension's messages are prefixed with [wozjac.ui5].

![console](http://public_repo.vipserv.org/images/console.png)

## Features
### UI5 API reference panel
The API reference panel shows UI5 documentation in a side panel (thanks to Hirse and his [Brackets Outline List](https://github.com/Hirse/brackets-outline-list) for the example and inspiration).
It can be opened via the *UI5 tools* menu, Ctrl + 2 or the side icon ![api icon](http://public_repo.vipserv.org/images/icon.png)

![API reference panel](http://public_repo.vipserv.org/images/panel.png)

Functionality:
- search can be done with or without namespace
- members search is supported after space, for example typing "m.page add" will show the hitlist with matching objects and then, after selecting desired object, only members matching the "add" word will be showed; anything typed after the space will filter the displayed API - as long as the base object search string (the one before space) has not changed
![filtered search](http://public_repo.vipserv.org/images/api_filtered.jpg)
- displaying specific members: ?p will display only properties, ?c - contructor, ?e - events, ?m - methods; this can be also filtered by a search term. For example to search sap.m.Page properties with "add" term, type: m.page ?padd
![members_search](http://public_repo.vipserv.org/images/filtered_search.png)
- clicking the [+]/[-] sign will expand or collapse the description 
- if the item is clickable (object name, methods, properties etc.): **left click** will insert the name at the current cursor position, **right click** will open element's online documentation in the default browser 
- items with line-through decoration are deprecated
- *Insert (define)* will insert the object at the end of the **existing** sap.ui.define/sap.ui.require statement; formatting or beautifying is **not** applied. If the preference *brackets.Ui5.insertObjectsInDefine* is set to true (default: false) then object's name (without its namespace) will be also inserted at the current cursor position 

![insert into define](http://public_repo.vipserv.org/images/insert-define.gif)
- *Insert (/)* - will insert the object full name with "/" at the cursor position, for example, "sap/m/Button", useful sometimes to fill a define statement list. The preference *"bracketsUi5.objectPathsInQuotes": true/false* (default: false) controls if the object's path will be inserted in quotes, while *"bracketsUi5.useSingleQuotes": true/false* (defualt: false) decides whether it will be " or '.

Please check the [preferences](#preferences) for details about preferences.

The panel shows **public** members. Optional items are marked with *opt*.

The format is:
- methods: name(parameters) *return type*
- events: name(parameters)
- properties: name *type*
- aggergations [cardinality] *type*
- constructor: parameter's name *type*

### Configurable code snippets
The extension provides 8 configurable code snippets, available via the *UI5 tools* menu or using Ctrl-Alt-1..8 shortcut. They are inserted at the current cursor position. By default, there are a component, XML view, index.html etc. but this can be adjusted - *Open snippets folder* will open the folder with snippets files, which can be edited (do not change the filenames!). The first line is reserved for the title in form of *// my title*. The "my title" will be then used in the menu as *Insert: my title*.

For example:

```
//object extend
Object.extend("", {
    constructor: function() {}
});
```

![snippet menu item](http://public_repo.vipserv.org/images/menu-snippet.png)

** Please remember to reload the editor (F5) after editing the snippets.**

### oData mock data generator
The oData mock data generator is based on the [MockServer](https://openui5.hana.ondemand.com/#/api/sap.ui.core.util.MockServer/methods/sap.ui.core.util.MockServer.config) and can be used for generation of JSON files with random data based on the oData service definition. By default, the generator will look for a service metadata XML file in the project's root path *localService/metadata.xml* and create mock data files in the *localService/mockData* folder. The path can be changed with the preference *"bracketsUi5.metadataPath": "my/path/service.xml"*. It can also be a URL to metadata, for example, https://services.odata.org/V3/OData/OData.svc/$metadata. The path for mock data files is set via *"bracketsUi5.mockDataDir": "myDir"* 

For the [Northwind test service](https://services.odata.org/V3/OData/OData.svc/$metadata):

![mock files](http://public_repo.vipserv.org/images/mock-files.png)

By default in each file there will be 30 entries (this is adjustable by the preference *"bracketsUi5.mockDataEntitySize": number*) and new files will overwrite old ones (change this with *"bracketsUi5.mockDataOverwrite": true/false*. 

![mock file](http://public_repo.vipserv.org/images/mock-example.png)

The default root URI is an empty string, it can be changed by setting *"bracketsUi5.mockDataRootUri": "myURI"*.

Please check the [preferences](#preferences) for details about preferences.

#### Configuring mock data generation
In the mock data folder (bracketsUi5.mockDataDir), a special file named *.mockconfig.json* can be used to influence mock data generation. 

##### Skipping mock data generation
"skipMockGeneration": [*EntitySetName1*,*EntitySetName2*] - mock data generation will be skipped for selected entity sets, for example:
```javascript
{
    "skipMockGeneration": ["Persons", "Suppliers"]
}
```

##### Predefined values
If for some entities randomly selected but predefined values should be picked up, it can be configured in the following way:
```javascript
{
    "predefined": {
        "Entity": {
            "Property": [Value1, Value2, Value3]
        }
    }
}
```
for example:
```javascript
{
    "predefined": {
        "Product": {
            "Rating": [1, 2, 3]
        }
    }
}
```

##### Predefined values based on other values
For some values it make sense to make them dependent on other values. This can be achieved with:
```javascript
{
    "predefined": {
        "Entity": {
            "Property1": [Value1, Value2, Value2],
            "Property2": {
                "reference": "Property1",
                "values": [{
                    "key": Value1,
                    "value": "Description for value 1"
                },{
                    "key": Value2,
                    "value": "Description for value 2"
                }]
            }
        }
    }
}

Not all dependent values has to be provided - if not found in *values* array, it will be generated as usual.
```
Example:
```javascript
{
    "predefined": {
        "Product": {
            "Rating": [1, 2, 3],
            "Description": {
                "reference": "Rating",
                "values": [{
                    "key": 1,
                    "value": "Description for rating 1"
                }]
            }
        }
    }
}
```
##### Re-using predefined values
It easier to keep predefined values in one place, as they might be used in several places. It can be done with help of special *variables* property and special $ref:... handling:
```javascript
{
    "variables": {
        "myValues": [value1, value2, value3]
    },
    "predefined": {
        "Entity": {
            "Property1": "$ref:myValues",
            "Property2": {
                "reference": "Property1",
                "values": [{
                    "key": "value1",
                    "value": "Text1"
                }, {
                    "key": "value2",
                    "value": "Text2"
                }]
            }
        }
    }
}
```
for example
```javascript
{
    "variables": {
        "categoryIds": ["ID1", "ID2", "ID3"]
    },
     "predefined": {
        "Category": {
            "ID": "$ref:categoryIds",
            "Name": {
                "reference": "ID",
                "values": [{
                    "key": "ID1",
                    "value": "Category1"
                }, {
                    "key": "ID2",
                    "value": "Category2"
                }, {
                    "key": "ID3",
                    "value": "Category3"
                }]
            }
        }
    }
}
```

Please check the Appendix A for sample .mockconfig file.

### Quick docs
Quick docs is a Brackets feature and provide inline documentation for a token at the current cursor position (Ctrl + k). Supported are .js files and XML views.  
This feauture is related with Code Hints (resolving types) - please check "UI5 identifier type recognition" section for more details.

![quick docs](http://public_repo.vipserv.org/images/quick-docs.png)

### Quick edit
In XML views quick edit (ctrl+e) will open inline editor for:
- controller function names in attributes (comples binding syntax not supported):
For example pressing ctrl+e on *.handleChange*

![quickedit function](http://public_repo.vipserv.org/images/quick-edit-function.png)

- i18n keys in i18n bindings (manifest.json is present and contains a valid i18n model entry, both *uri* and *bundleName* settings are supported). Pressing ctrl+e opens inline editor for the i18n entry; if it don't exist, it will be created and appended at the end of the file.

![i18n quick edit](http://public_repo.vipserv.org/images/i18n_quick_edit_short.gif)

### Code hints
In XML views:
- tags and attributes (namespaces are supported)

![xml hints](http://public_repo.vipserv.org/images/xml-hints-collage.jpg)
- i18n keys in i18n bindings (manifest.json is present and contains a valid i18n model entry, both *uri* and *bundleName* settings are supported)

![i18n hints](http://public_repo.vipserv.org/images/i18n_hints_short.gif)

### Code hints for UI5 objects
Code hints in JS files displays public properties & methods of a UI5 object. Recognition works for basic cases based on the current scope - please check "UI5 identifier type recognition in Javascript code" section for handled cases. Module memebers (sap.ui for example) are also hintable.  
A convenient feature is when you use *this.byId("controlId")* function (or any with "byId" in its name) - it will try to find the control type in the associated view.

![code hints](http://public_repo.vipserv.org/images/code-hints-collage.jpg)

### Jump to definition
In XML views quick edit (ctrl+j) will jump to the file with the definition of:
- controller function
- i18n entry in i18n bindings (manifest.json is present and contains a valid i18n model entry, both *uri* and *bundleName* settings are supported)

## UI5 identifier type recognition in Javascript code
The recognition is relevant for quick docs and code hints in Javascript files, works for basic cases.

Currently, the type of an identifier will be resolved from:
1. A special comment *//ui5: object*. It will search the current line or the variable declaration.
```javascript
const button = getButton() //ui5: sap.m.Button
    if(button) { //Ctrl+k opens quick docs and typing . after the variable opens hints
        ...
    }
```

2. Variable initialization with *new* with objects from the *define* statement
```javascript
this.page = new MasterPage();
this.page. //ctrl+k, hints
const range = new DateRangeSelection();
range.  //ctrl+k, hints
```

3. *this.byId("controlId"), or other method with "byId" in the name*
It will try to recognize the control type using the associated view.
```javascript
const control = this.byId("myId");
    control. //ctrl+k, hints - if it will find the view and myId inside it
```

## Preferences
The extension uses Brackets [preferences](https://github.com/adobe/brackets/wiki/How-to-Use-Brackets) system, which means that you can specify per project settings by defining a .brackets.json in the root directory of your project. Below is a sample file with all options and their default values, which can be copy-pasted or used as a reference. For more information about specific option please check the related feature documentation.

```javascript
{
    "bracketsUi5.apiUrl": "https://openui5.hana.ondemand.com", 
    "bracketsUi5.objectPathsInQuotes": false,
    "bracketsUi5.useSingleQuotes": false,
    "bracketsUi5.insertObjectsInDefine": false,
    "bracketsUi5.metadataPath": "localService/metadata.xml",
    "bracketsUi5.mockDataDir": "localService/mockData",
    "bracketsUi5.mockDataRootUri": "",
    "bracketsUi5.mockDataEntitySize": 30,
    "bracketsUi5.mockDataOverwrite": true,
    "bracketsUi5.insertMethodSignature": true
}
```

Quick reference:
- apiUrl: UI5 library URL (version specific URL are supported)
- objectPathsInQuotes: Insert* actions in the API panel will/will not put the object in quotes...
- useSingleQuotes: ...and for true it will be ' instead of "
- insertObjectsInDefine: *Insert(define)* action in the API panel will/will not insert the object's name (without its namespace) at the current cursor position
oData mock data generator:
- metadataPath: the path to the oData service used by oData mock data generator
- mockDataDir: where the oData mock data generator should save created JSON files
- mockDataRootUri: the root URI for mock data
- mockDataEntitySize: how many entries should be created
- mockDataOverwrite: whether to overwrite or not existing JSON files
- insertMethodSignature: whether to insert method signature when using code hints

## Unit tests
Unit tests are using Brackets embedded mechanism based on Jasmine. The entry point is the unittests.js file, you can run in via menu path Debug->Run Tests. Please keep in mind, that this option is not available in the standard version; to reveal it a version [build from source](https://github.com/adobe/brackets/wiki/How-to-Hack-on-Brackets) is required.

## License
This plugin is licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md).

## Author
Feel free to contact me: wozjac@zoho.com or via LinkedIn (https://www.linkedin.com/in/jacek-wznk).

## Appendix A
Sample .mockconfig.json file, based on Northwind oData metadata: https://services.odata.org/V3/OData/OData.svc/$metadata
```javascript
{
    "variables": {
        "categoryIds": ["ID1", "ID2", "ID3"]
    },
    "skipMockGeneration": ["Persons", "Suppliers"],
    "predefined": {
        "Product": {
            "Rating": [1, 2, 3],
            "Description": {
                "reference": "Rating",
                "values": [{
                    "key": 1,
                    "value": "Description for rating 1"
                }]
            }
        },
        "Category": {
            "ID": "$ref:categoryIds",
            "Name": {
                "reference": "ID",
                "values": [{
                    "key": "ID1",
                    "value": "Category1"
                }, {
                    "key": "ID2",
                    "value": "Category2"
                }, {
                    "key": "ID3",
                    "value": "Category3"
                }]
            }
        }
    }
}
```
