# Brackets UI5

1. [Intro](#info)
2. [Features summary](#features-summary)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Features details](#features)
6. [Preferences](#preferences)
7. [Unit tests](#unit-tests)
8. [Known issues](#known-issues)
9. [Further development](#further-development)
10. [License](#license)
11. [Contributing](#contributing)
12. [Author](#author)

## Info
An extension for [Brackets](http://brackets.io) editor providing helpers (quick docs, code hints, API reference and more) for SAP© UI5 library [OpenUI5](openui5.hana.ondemand.com)/[SAPUI5](https://sapui5.hana.ondemand.com).

Works with UI5 versions >= 1.52 with online documentation available, please check here: [https://openui5.hana.ondemand.com/versionoverview.html](https://openui5.hana.ondemand.com/versionoverview.html), 
scroll down to the section "Available OpenUI5 Versions". For SAP UI5 please use [https://sapui5.hana.ondemand.com/versionoverview.html](https://sapui5.hana.ondemand.com/versionoverview.html).  

As the majority of the older versions is out of maintenance, I do not plan to add support for them.

**Please notice (if you are new to UI5)! [OpenUI5](https://openui5.org) is open source, but SAPUI5 - although SAP shares publicly SAPUI5 library runtime & SDK etc. - is not free. Please check the company [site](https://sap.com) for more details.**

## Features summary
- UI5 API reference panel
- tag & attribute hints in XML views,
- i18n value help & quick edit in XML views,
- code hints for UI5 objects (variable type recognition under development)
- configurable code snippets
- mock data generation for oData services
- quick docs for UI5 API (variable type recognition under development)

For quick docs and code hints only basic cases are handled - please check the documentation below for details.

## Requirements
Brackets version >= 1.11

## Installation
The extension is not yet added to the Bracket extensions repository. It can be installed using a downloaded ZIP file, extension's GitHub repository URL: https://github.com/wozjac/brackets-ui5 or ZIP file URL: https://github.com/wozjac/brackets-ui5/archive/master.zip.

![install](https://www.mediafire.com/convkey/6a27/l6ae100r9dj3azy6g.jpg)

After successful installation the *UI5 tools* menu should be available.

![menu](https://www.mediafire.com/convkey/084f/ka8lbla1rjvkrmi6g.jpg)

By default, the extension uses the latest OpenUI5 version available (https://openui5.hana.ondemand.com).
This can be changed using Brackets [preferences](#preferences). For example, create .brackets.json file in the project's root and set the required library version (>= 1.52.0): 
```javascript
{
    "bracketsUi5.apiUrl": "https://openui5.hana.ondemand.com/1.54.2"
}
```
Switching to SAPUI5:
```javascript
{
    "bracketsUi5.apiUrl": "https://sapui5.hana.ondemand.com"
}
```
**NOTE: when using the default URL or bracketsUi5.apiUrl option without a version**: 
- for SAPUI5 sometimes schema files are not available
- the newest version could not have all API docs published  

**A preferred way is to always use a preference file with the *bracketsUi5.apiUrl* poiting to a specific version.**


If something is not working please check the console (F12). Extension's messages are prefixed with [wozjac.ui5].

![console](https://www.mediafire.com/convkey/e45c/kbwi4ux1p6bxd676g.jpg)

## Features
### UI5 API reference panel
The API reference panel shows UI5 documentation in a side panel (thanks to Hirse and his [Brackets Outline List](https://github.com/Hirse/brackets-outline-list) for the example and inspiration).
It can be opened via the *UI5 tools* menu, Ctrl + 2 or the side icon ![api icon](https://www.mediafire.com/convkey/5cd4/kuggxo1kdgm67wp6g.jpg)

![API reference panel](https://www.mediafire.com/convkey/143f/q771rfj7ggs107d6g.jpg)

Functionality:
- search can be done with or without namespace
- members search is supported after space, for example typing "m.page add" will show the hitlist with matching objects and then, after selecting desired object, only members matching "add" word will be showed; anything typed after the space will filter the displayed API - as long as the base object search string (the one before space) has not changed
![filtered search](https://www.mediafire.com/convkey/dabe/futwsi6t6832zf56g.jpg)
- clicking the [+]/[-] sign will expand or collapse the description 
- if the item is clickable (object name, methods, properties etc.): **left click** will insert the name at the current cursor position, **right click** will open element's online documentation in the default browser 
- items with line-through decoration are deprecated
- *Insert (define)* will insert the object at the end of the **existing** sap.ui.define/sap.ui.require statement; formatting or beautifying is **not** applied. If the preference *brackets.Ui5.insertObjectsInDefine* is set to true (default: false) then object's name (without its namespace) will be also inserted at the current cursor position 

![insert into define](https://www.mediafire.com/convkey/653d/1reg1ck7a523hog6g.jpg)
- *Insert (/)* - will insert the object full name with "/" at the cursor position, for example, "sap/m/Button", useful sometimes to fill a define statement list. The preference *"bracketsUi5.objectPathsInQuotes": true/false* (default: false) controls if the object's path will be inserted in quotes, while *"bracketsUi5.useSingleQuotes": true/false* (defualt: false) decides whether it will be " or '.

Please check the [preferences](#preferences) for details about preferences.

The panel shows **public** members.

The format is:
- methods: name(parameters) *return type*
- events: name(parameters)
- properties: name *type*
- aggergations [cardinality] *type*
- constructor: parameter's name *type*

### XML view tags & attributes hints
Namespaces are supported.  
![xml hints](https://www.mediafire.com/convkey/7c85/vs1muc5m4zmzdc46g.jpg)

### i18n value help & quick edit
Works in XML views if manifest.json is present and contains a valid model entry (both *uri* and *bundleName* settings are supported. For example,

```
...
    "models": {
            "i18n": {
                "type": "sap.ui.model.resource.ResourceModel",
                "settings": {
                    "bundleName": "com.some.i18n"
                },
                "preload": "async"
            },
...
```

![i18n hints](https://www.mediafire.com/convkey/82d5/tonl3c4pmf8ur8o6g.jpg)

Pressing ctrl+e opens inline editor for the i18n entry; if don't exist, it will be created and appended at the end of the file.
![i18n quick edit](https://www.mediafire.com/convkey/630a/h8ek9xbsk8f2h2u6g.jpg)

### Configurable code snippets
The extension provides 8 configurable code snippets, available via the *UI5 tools* menu or using Ctrl-Alt-1..8 shortcut. They are inserted at the current cursor position. By default, there are a component, XML view, index.html etc. but this can be adjusted - *Open snippets folder* will open the folder with snippets files, which can be edited (do not change the filenames!). The first line is reserved for the title in form of *// my title*. The "my title" will be then used in the menu as *Insert: my title*.

For example:

```
//object extend
Object.extend("", {
    constructor: function() {}
});
```

![snippet menu item](https://www.mediafire.com/convkey/02f8/du73oefey4p9f4q6g.jpg)

** Please remember to reload the editor (F5) after editing the snippets.**

### oData mock data generator
The oData mock data generator is based on the [MockServer](https://openui5.hana.ondemand.com/#/api/sap.ui.core.util.MockServer/methods/sap.ui.core.util.MockServer.config) and can be used for generation of JSON files with random data based on the oData service definition. By default, the generator will look for a service metadata XML file in the project's root path *localService/metadata.xml* and create mock data files in the *localService/mockData* folder. The path can be changed with the preference *"bracketsUi5.metadataPath": "my/path/service.xml"*. It can also be a URL to metadata, for example, https://services.odata.org/V3/OData/OData.svc/$metadata. The path for mock data files is set via *"bracketsUi5.mockDataDir": "myDir"* 

For the [Northwind test service](https://services.odata.org/V3/OData/OData.svc/$metadata):

![mock files](https://www.mediafire.com/convkey/651a/j2hw3d6tcyhf25v6g.jpg)

By default in each file there will be 30 entries (this is adjustable by the preference *"bracketsUi5.mockDataEntitySize": number*) and new files will overwrite old ones (change this with *"bracketsUi5.mockDataOverwrite": true/false*. 

![mock file](https://www.mediafire.com/convkey/48ec/dix4oaku3ax6ldh6g.jpg)

The default root URI is an empty string, it can be changed by setting *"bracketsUi5.mockDataRootUri": "myURI"*.

Please check the [preferences](#preferences) for details about preferences.

### Quick docs
Quick docs is a Brackets feature and provide inline documentation for a token at the current cursor position (Ctrl + k).

**Please check the section *UI5 object resolving* to see when the extension recognizes a UI5 object type.**

![quick docs](https://www.mediafire.com/convkey/c18b/bwe4bc862ntg68h6g.jpg)

### Code hints for UI5 objects
Code hints in JS files are displaying properties & methods of a UI5 object.

**Please check the section *UI5 object resolving* to see when the extension recognizes a UI5 object type.**
![code hints](https://www.mediafire.com/convkey/e633/ums5nbag40af4il6g.jpg)

### UI5 object resolving
UI5 object recognition is currently based on regular expressions, so the basic cases are handled (and expect strange
behaviour sometimes ;). 

This feature is currently under development using more appriopriate tools for such tasks, but I decided
to keep this simple and not reliable version as it can be helpful.

The recognition works for variables and will try to find the associated UI5 object type from:
1. A special comment *//ui5: object*. It will search the current line or the variable declaration. Because in the current version the extension does not recognize types returned by functions, this comment can be useful if some variable - returned by a function - is used heavily in the code. For example:
```javascript
const button = getButton() //ui5: sap.m.Button

    if(button) { //Ctrl+k opens quick docs and typing . after the variable opens hints
        ...
    }
```

2. The object type from the construction and next, from the define statement. If the define statement is not present, try to match the name with an object from the API reference. If multiple objects are matched, favour sap.m objects. For example:

```javascript
var button = new Button()

button // //Ctrl+k opens quick docs and typing . after the variable opens hints
```
Because there is no "define" statement, the algorithm will match sap.m.Button and sap.ui.commons.Button. Because the first comes from the "sap.m" library, sap.m.Button will be selected.

```javascript
sap.ui.define(["sap/ui/commons/Button"], function(Button) {
    function doSomething() {
        var button = new Button();
        
        /* 
            Below sap.ui.commons.Button serves as a source for quick docs and code hints
            because it was resolved from the define statement
        */                    
        button.  
    }
});
```

3.Matching the token with the objects in the define statement.

```javascript
sap.ui.define(["sap/m/Button"], function(Button) {
   Button 
});
```
The button will be just directly matched with the object from the define statement.

The above algorithm is rather simple and will not recognize types returned from methods or via assignments.

```javascript
sap.ui.define(["sap/m/Button"], function(Button) {
    //...
    var button = new Button();
    var newButton = button;

    newButton //quick docs * hints won't work

    var titleLabel = getLabel();
    
    titleLabel ////quick docs * hints won't work
});
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

## Known issues
- no code hints for some full-path objects like jQuery.sap

## Further development
- code analysis and type recognition for hints and quick docs based on built-in Tern/Acorn

## License
This plugin is licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md).

## Author
Feel free to contact me: wozjac@zoho.com or via LinkedIn (https://www.linkedin.com/in/jacek-wznk).
