[![Build Status](https://travis-ci.com/wozjac/brackets-ui5.svg?branch=master)](https://travis-ci.com/wozjac/brackets-ui5)

# Brackets UI5

1. [Intro](#info)
2. [Features summary](#features-summary)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Features details](#features)  
    5.1 [UI5 API reference panel](#ui5-api-reference-panel)  
    5.2 [Quick docs](#quick-docs)    
    5.3 [Quick edit](#quick-edit)  
    5.4 [Code hints](#code-hints-1)   
    5.5 [Jump to definition](#jump-to-definition)  
    5.6 [Configurable code snippets](#configurable-code-snippets)  
    5.7 [oData mock data generator](#odata-mock-data-generator)  
6. [Preferences](#preferences)
7. [Unit tests](#unit-tests)
8. [Credits](#credits)
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
- hints based on Tern.js, UI5 objects included 

##### Jump to definition [ctrl+j]
XML views:
- controller functions in attributes 
- i18n keys

Preview of quick edit, docs and jump to actions:  
<a href="http://www.youtube.com/watch?feature=player_embedded&v=v6OuMKnhNYQ" target="_blank"><img src="https://img.youtube.com/vi/v6OuMKnhNYQ/0.jpg" 
alt="Quick actions - video preview" width="240" height="180" border="10" /></a>

## Requirements
- Brackets version 1.14.2

## Installation
Install via Brackets Extension manager - search for "Brackets UI5".  
If the extension is not present (happens) - download wozjac.ui5.zip file from the Releases page and drag into the extension installer.

![install](http://public_repo.vipserv.org/images/install.png)

After successful installation the *UI5 tools* menu should be available.

![menu](http://public_repo.vipserv.org/images/menu.png)

By default, the extension uses the OpenUI5 version 1.72.4. 
This can be changed using Brackets [preferences](#preferences). Create .brackets.json file in the project's root and set the required library version. Please check the [wiki page](https://github.com/wozjac/brackets-ui5/wiki/OpenUI5-SAPUI5-library-versions) for valid library versions, which can be safely used.
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

If something is not working please check the console (F12). Extension's messages are prefixed with [wozjac.ui5].

![console](http://public_repo.vipserv.org/images/console.png)

To avoid Brackets built-in ESLint errors like "sap is not defined", install ESLint first (npm install eslint), then add ESLint configuration in the project with your desired settings and *sap* in the globals section (and other used globally UI5 like QUnit, assert etc.)

## Features
### UI5 API reference panel
The API reference panel shows UI5 documentation in a side panel (thanks to Hirse and his [Brackets Outline List](https://github.com/Hirse/brackets-outline-list) for the example and inspiration).
It can be opened via the *UI5 tools* menu, Ctrl + 2 or the side icon ![api icon](http://public_repo.vipserv.org/images/icon.png)
OR by hitting Ctrl+3 in JS code - if the token is resolvable to an UI5 object, it will be opened in the panel.

![API reference panel](http://public_repo.vipserv.org/images/panel.png)

Functionality:
- search can be done with or without namespace
- members search is supported after space, for example typing "m.page add" will show the hitlist with matching objects and then, after selecting desired object, only members matching the "add" word will be showed; anything typed after the space will filter the displayed API - as long as the base object search string (the one before space) has not changed
![filtered search](http://public_repo.vipserv.org/images/api_filtered.jpg)
- displaying specific members: ?p will display only properties, ?c - constructor, ?e - events, ?m - methods; this can be also filtered by a search term. For example to search sap.m.Page properties with "add" term, type: m.page ?padd
![members_search](http://public_repo.vipserv.org/images/filtered_search.png)
- clicking the [+]/[-] sign will expand or collapse the description 
- if the member is clickable (object name, methods, properties etc.): **left click** will insert the name at the current cursor position, **right click** will open element's online documentation in the default browser 
- members with line-through decoration are deprecated
- if a return or parameter type is a UI5 object, clicking it will open it in the panel
- *Insert (define)* will insert the object at the end of the **existing** sap.ui.define/sap.ui.require statement; formatting or beautifying is **not** applied. If the preference *brackets.Ui5.insertObjectsInDefine* is set to true (default: false) then object's name (without its namespace) will be also inserted at the current cursor position 

![insert into define](http://public_repo.vipserv.org/images/insert-define.gif)
- *Insert (/)* - will insert the object full name with "/" at the cursor position, for example, "sap/m/Button", useful sometimes to fill a define statement list. The preference *"bracketsUi5.objectPathsInQuotes": true/false* (default: false) controls if the object's path will be inserted in quotes, while *"bracketsUi5.useSingleQuotes": true/false* (defualt: false) decides whether it will be " or '.

Please check the [preferences](#preferences) for details about preferences.

The panel shows **public** members. Optional items are marked with *?*.

The format is:
- methods: name(parameters) *return type*
- events: name(parameters)
- properties: name *type*
- aggergations [cardinality] *type*
- constructor: parameter's name *type*

### Quick docs
Quick docs is a Brackets feature and provide inline documentation for a token at the current cursor position (Ctrl + k). Supported are .js files and XML views.  
In .js code type recognition is done using Tern engine.

![quick docs](http://public_repo.vipserv.org/images/quick-docs.png)

### Quick edit
In XML views quick edit (ctrl+e) will open inline editor for:
- controller function names in attributes; if function not found in the controller, it will be searched in all .js files (*dist* and *node_modules* folders skipped)
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

In JS code:
- Tern is used for getting hints; UI5 objects definitions (methods and properties) are included

![code hints](http://public_repo.vipserv.org/images/hints-collage.png)

Code hints also works in sap.ui.define and after selection inserts the object into array and function arguments.
![code hints](http://public_repo.vipserv.org/images/hints-define.gif)

### Jump to definition
In XML views quick edit (ctrl+j) will jump to the file with the definition of:
- controller function (for example event handler); if not found in the controller, it will be searched in all .js files (*dist* and *node_modules* folders skipped)
- i18n entry in i18n bindings (manifest.json is present and contains a valid i18n model entry, both *uri* and *bundleName* settings are supported)

Preview of quick edit, quick docs and jump to actions:  
<a href="http://www.youtube.com/watch?feature=player_embedded&v=DqBN-7dZwIQ" target="_blank"><img src="http://img.youtube.com/vi/DqBN-7dZwIQ/0.jpg" 
alt="Quick actions - video preview" width="240" height="180" border="10" /></a>  

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

##### Distinct values
Having predefined values for entities and their key properties, duplicated entries will be present, as the generator always produces the number 
of entries specified by the *bracketsUi5.mockDataEntitySize* preference.   
To have only distinct values (based on all key properties):
```
{   
    "variables": [...]
    "distinctValues": ["EnitytSet1", "EntitySet2"]
    ...
}
```

Please check the Appendix A for sample .mockconfig file.

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
    "bracketsUi5.mockDataOverwrite": true
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

## Unit tests
Unit tests are using Brackets embedded mechanism based on Jasmine. The entry point is the unittests.js file, you can run in via menu path Debug->Run Tests. Please keep in mind, that this option is not available in the standard version; to reveal it a version [build from source](https://github.com/adobe/brackets/wiki/How-to-Hack-on-Brackets) is required.

## Credits
- Tern.js [Tern](https://ternjs.net) used as Javascript code analysis engine  
- properties file handling based on Matt Steele [java-properties](https://github.com/mattdsteele/java-properties) code  
- xml-parser by Yusuke Kawasaki  
- flatted from Andrea Giammarchi [https://github.com/WebReflection](https://github.com/WebReflection)  
- ODataMockGenerator based on [OpenUI5](https://github.com/SAP/openui5) original MockGenerator

## License
This plugin is licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md).

## Author
Feel free to contact me:  
- wozjac@zoho.com 
- Twitter (https://twitter.com/jacekwoz)  
- LinkedIn (https://www.linkedin.com/in/jacek-wznk)

## Appendix A
Sample .mockconfig.json file, based on Northwind oData metadata: https://services.odata.org/V3/OData/OData.svc/$metadata
```javascript
{
    "variables": {
        "categoryIds": ["ID1", "ID2", "ID3"]
    },
    "skipMockGeneration": ["Persons", "Suppliers"],
    "distinctValues": ["Categories"],
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
