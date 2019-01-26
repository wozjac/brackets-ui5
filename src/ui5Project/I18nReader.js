define((require, exports, module) => {
    "use strict";

    const properties = require("src/3rdparty/properties"),
        strings = require("strings");

    class I18nReader {
        constructor(filePath) {
            this._propertiesFile = new properties.PropertiesFile();
            this._filePath = filePath;
        }

        open() {
            const promise = new Promise((resolve, reject) => {
                this._propertiesFile.addFile(this._filePath).then(() => {
                    resolve(true);
                }, (error) => {
                    reject(`${strings.MODEL_READ_ERROR}: ${error}`);
                });
            });

            return promise;
        }

        getValues() {
            const keys = this._propertiesFile.getKeys();
            return this._getValuesByKeys(keys);
        }

        getValuesStartingWith(partialKey) {
            const keys = this._propertiesFile.getKeysStartingWith(partialKey);
            return this._getValuesByKeys(keys);
        }

        _getValuesByKeys(keys) {
            let values;

            if (keys) {
                keys.forEach((key) => {
                    if (!values) {
                        values = [];
                    }

                    const value = this._propertiesFile.get(key);

                    if (typeof value === "object") {
                        value.forEach((entry) => {
                            const newEntry = {};
                            newEntry[key] = entry;
                            values.push(newEntry);
                        });
                    } else {
                        const newEntry = {};
                        newEntry[key] = value;
                        values.push(newEntry);
                    }
                });
            }

            function compare(a, b) {
                const aKeys = Object.keys(a),
                    bKeys = Object.keys(b),
                    aKey = aKeys[0],
                    bKey = bKeys[0];

                if (aKey < bKey) {
                    return -1;
                }

                if (aKey > bKey) {
                    return 1;
                }

                return 0;
            }

            if (values) {
                values.sort(compare);
            }

            return values;
        }
    }

    module.exports = I18nReader;
});
