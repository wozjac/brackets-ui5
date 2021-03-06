# brackets-ui5 changelog

## 1.5.6
##### Fixed
- remove hinting in string literals
- update documentation

## 1.5.5
##### Fixed
- case insesitive hints search 

## 1.5.4
##### Fixed
- correct API panel search input value while object is opened via ctrl+3

## 1.5.3
##### Fixed
- fix ui5 objects initialization and preparation of the API/tern definitions
- adjust README to the current state

## 1.5.2
##### Fixed
- correct hints in js code while definig new variables

## 1.5.1
##### Fixed
- minor corrections to previous version

## 1.5.0
##### Added
- tern.js as a JS type/hints resolver for UI5 objects (code hints, quick docs)
- links in API Panel to UI5 objects
- shorter formatting of optional parameters in API panel / Quick Docs
- Ctrl+3 for opening UI5 objects form JS code

## 1.4.15
##### Added
- more .js files searched when quick-jump action used
- more .js files searched when quick-edit action used

##### Fixed
- fixed several bugs with quick actions

## 1.4.14
##### Fixed
- correct handling of expand/collapse for the same names in the hierarchy in the API panel
- remove i18n error when hint not found

## 1.4.13
##### Added
- new "distinctValues" option for mock generator

## 1.4.12
##### Fixed
- fix loading text files during extension startup

## 1.4.11
##### Added
- hints in sap.ui.define

##### Fixed
- replace require(!text) calls for snippets initalization

## 1.4.10-beta
##### Fixed
- error handling for missing/incorrect .mockconfig.json

## 1.4.9-beta
##### Added:
- specific OpenUI5 version as a default version

## 1.4.8-beta
##### Added
- optional parameters markers in Quick Docs & Panel

##### Fixed
- ...byId.. call type recognition 

## 1.4.7-beta
##### Added:
- .mockconfig.json for configuring values used in generation of mock data

## 1.4.6-beta
##### Added
- Quick Jump: open controller file at the beginning if function does not exist

## 1.4.5-beta
##### Fixed
- correct case in module names - causing "module not found" in Linux os

## 1.4.4-beta
##### Fixed
- handling "modules:..." API in the docs panel & code features

## 1.4.3-beta
##### Added
- inserting full method signature is now controller in preferences
- Quick Docs in XML views

## 1.2.2-beta
##### Added
- jump to definition in XML views for i18n keys in i18n bindings
- jump to definition in XML views for controller functions
- quick edit in XML views for controller functions

##### Changed
- temporarily limit ui5 type recognition to commented entries

## 1.2.1-beta
##### Fixed
- reading path for i18n file if "uri" option used in the model defition

## 1.2.0-beta
##### Added
- i18n model hints & quick edit in XML views

##### Changed
- switch to /discovery/all_libs URL for getting the .xsd libs
- documentation update

## 1.1.1-beta
##### Fixed
- fix preparing XML attributes (added missing ones like id, tooltip)

## 1.1.0-beta
##### Changed:
- add support for inherited properties in the API panel, code hints and Quick Docs
- preload and prepare all UI5 libraries at the Brackets startup
- refresh the API panel and Quick Docs - more information is shown, unified handling of left and righ clicks
- add link to the full documentation in code hints
- various stylish improvements

##### Fixed:
- correct handling of cached UI5 design API
- quick docs button overflow issue
- various bug during objects and sub-objects resolving process

## 1.0.3-beta
##### Fixed:
- dump in ui5formatter when no contructor parameters are present
- dump in ui5formatter for static classes without properties
- sorting of methods & properties in code hints

## 1.0.0-beta
The very first public version. Hooray!