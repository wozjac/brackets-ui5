# Brackets-UI5

## Info
An extension for [Brackets](http://brackets.io) editor providing helpers (quick docs, code hints, API reference and more) for SAP© UI5 library [OpenUI5](openui5.hana.ondemand.com)/[SAPUI5](https://sapui5.hana.ondemand.com).

Works with UI5 versions >= 1.52.0. As the majority of the older versions is out of maintenance, I do not plan to add support for them.

**Please notice (if you are new to UI5)! [OpenUI5](https://openui5.org) is open source, but SAPUI5 - although SAP shares publicly SAPUI5 library runtime & SDK etc. - is not free. Please check the company [site](sap.com) for more details.**

## Features summary
- API reference panel
- tag & attribute hints for XML view
- code hints for UI5 objects (partially supported)
- configurable code snippets
- mock data generation for oData services
- quick docs

For quick docs and code hints not all cases are handled - please check the documentation below for details.

## Requirements
Brackets version >= 1.11

## Installation
The extension is not yet added to the Bracket extensions repository. It can be installed using a downloaded ZIP file, extension's GitHub repository URL: https://github.com/wozjac/brackets-ui5 or ZIP file URL: https://github.com/wozjac/brackets-ui5/archive/master.zip.

![install](https://www.mediafire.com/convkey/6a27/l6ae100r9dj3azy6g.jpg)

After successful installation the *UI5 tools* menu should be available.

![menu](https://www.mediafire.com/convkey/084f/ka8lbla1rjvkrmi6g.jpg)

By default, the extension uses the latest OpenUI5 version available (https://openui5.hana.ondemand.com).
This can be changed using Brackets [preferences](#preferences). For example, create .brackets.json file in project's root and set the required library version (>= 1.52.0): 
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

If something is not working please check the console (F12). Extension's messages are prefixed with [wozjac.ui5].

![console](https://www.mediafire.com/convkey/e45c/kbwi4ux1p6bxd676g.jpg)

## Features
### API reference panel
The API reference panel shows UI5 documentation in a side panel (thanks to Hirse and his [Brackets Outline List](https://github.com/Hirse/brackets-outline-list) for the example).
It can be opened via the *UI5 tools* menu, Ctrl + 2 or the side icon ![api icon](https://www.mediafire.com/convkey/5cd4/kuggxo1kdgm67wp6g.jpg)

![API reference panel](https://www.mediafire.com/convkey/7d06/0g3d8tol9q938q06g.jpg)

Functionality:
- search can be done with or without namespace objects
- clicking the [+]/[-] sign will expand or collapse the description 

![api panel expanded](https://www.mediafire.com/convkey/b230/bcvp4hg6vfkvijo6g.jpg)
- clicking object's name will show the object API documentation page in the default browser.
- *Insert (define)* will insert the object at the end of the **existing** define statement; formatting or beautifying is **not** applied. The object name (without its namespace) will be inserted at the current cursor position if the preference *brackets.Ui5.insertObjectsInDefine* is set to true (default: false)

![insert into define](https://www.mediafire.com/convkey/392d/2c72n124v4errdv6g.jpg)
- *Insert* - will insert the object full name at the cursor position
- *Insert (/)* - will insert the object full name with "/" at the cursor position, for example, "sap/m/Button", useful sometimes to fill a define statement list

The last two inserts uses additional preferences: *"bracketsUi5.objectPathsInQuotes": true/false* (default: false) and *"bracketsUi5.useSingleQuotes": true/false* (defualt: false). The first one controls if the object's path will be inserted in quotes, while the second decides whether it will be " or '.

Please check the [preferences](#preferences) for details about preferences.

The panel shows object's **public** methods and properties, events and constructor.

![object API](https://www.mediafire.com/convkey/a47c/8hjbu1ric40fqdd6g.jpg)

The format is:
- methods: name(parameters) *return type*
- events: name(parameters)
- properties: name *type*
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

![snippet menu item](https://www.mediafire.com/convkey/02f8/du73oefey4p9f4q6g.jpg)

** Please remember to reload the editor (F5) after editing the snippets.**

### oData mock data generator
The oData mock data generator is based on the [MockServer](https://openui5.hana.ondemand.com/#/api/sap.ui.core.util.MockServer/methods/sap.ui.core.util.MockServer.config) and can be used for generation of JSON files with random data based on the oData service definition. By default, the generator will look for a service metadata XML file in the project's root path *localService/metadata.xml* and create mock data files in the *localService/mockData* folder. The path can be changed with the preference *"bracketsUi5.metadataPath": "my/path/service.xml"*. It can also be a URL to a metadata, for example, http://services.odata.org/V3/OData/OData.svc/$metadata. The path for mock data files is set via *"bracketsUi5.mockDataDir": "myDir"* 

For the [Northwind test service](http://services.odata.org/V3/OData/OData.svc/$metadata):

![mock files](https://www.mediafire.com/convkey/651a/j2hw3d6tcyhf25v6g.jpg)

By default in each file there will be 30 entries (this is adjustable by the preference *"bracketsUi5.mockDataEntitySize": number*) and new files will overwrite old ones (change this with *"bracketsUi5.mockDataOverwrite": true/false*. 

![mock file](https://www.mediafire.com/convkey/48ec/dix4oaku3ax6ldh6g.jpg)

The default root URI is an empty string, it can be changed by setting *"bracketsUi5.mockDataRootUri": "myURI"*.

Please check the [preferences](#preferences) for details about preferences.

### Quick docs
Quick docs is a Brackets feature and provides inline documentation for a token at the current cursor position (Ctrl + k).

**Please check the section *UI5 object resolving* to see when the extension recognizes a UI5 object type.**

![quick docs](https://www.mediafire.com/convkey/77cf/8t1z4r9u20x1ibf6g.jpg)

### Code hints for UI5 objects
Code hints in JS files are displaying properties & methods of a UI5 object.

**Please check the section *UI5 object resolving* to see when the extension recognizes a UI5 object type.**
![code hints](https://www.mediafire.com/convkey/e4ae/6ib3y61o6x0geb16g.jpg)

### UI5 object resolving
UI5 object recognition is currently based on regular expressions, so the basic cases presented below (determined in that order) should work and recognize the UI5 object in the code - but I can not guarantee that for all formatting cases it will work. I'm planning to use Brackets built-in Tern/Acorn modules for this task.

The recognition works for variables and will try to find the associated UI5 object type from:
1. A special comment *//ui5: object*. It will search the current line or the variable declaration. Because in the current version the extension does not recognize types returned by functions, this comment can be useful if some variable - returned by a function - is used heavily in the code. For example:
```javascript
const button = getButton() //ui5: sap.m.Button

    if(button) { //Ctrl+k opens quick docs and typing . after the variable opens hints
        ...
    }
```

2. The object type from the construction and next, from the define statement. If the define statement is not present, try to match the name with an object from the API reference. If multiple objects are matched, skip deprecated and favour sap.m objects. For example:

```javascript
var button = new Button()

button // //Ctrl+k opens quick docs and typing . after the variable opens hints
```
Because there is no define statement, the algorithm will match sap.m.Button and sap.ui.commons.Button. Because the latter is deprecated, sap.m.Button will be selected.

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

3. Matching the token with the objects in the define statement.

```javascript
sap.ui.define(["sap/m/Button"], function(Button) {
   Button 
});
```
The button will be just directly matched with the object from the define statement.

The above algorithm is rather simple and will not recognize types returned from methods or via assignments:

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

### Tag & attributes hints (XML views)
![xml tags](https://www.mediafire.com/convkey/65fd/37tl8oyx5bozk0i6g.jpg)

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
Unit tests are using Brackets embedded mechanism based on Jasmine. The entry point is unittests.js file, you can run in via menu path Debug->Run Tests. Please keep in mind, that this option is not available in the standard version; to reveal it a version [build from source](https://github.com/adobe/brackets/wiki/How-to-Hack-on-Brackets) is required.

## Further development
- code analysis (hints, quick docs) based on built-in Tern/Acorn

## License
This plugin is licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md).

## Author
Feel free to contact me: wozjac@zoho.com or via LinkedIn (https://www.linkedin.com/in/jacek-wznk).
