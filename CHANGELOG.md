# brackets-ui5 changelog

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