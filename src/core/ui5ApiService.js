define((require, exports) => {
    "use strict";

    const constants = require("src/core/constants"),
        strings = require("strings"),
        prefs = require("src/main/preferences");

    const ui5ObjectsDesignApiBufferLength = 30;

    const ui5Objects = {};
    const ui5LibrariesDesignApi = {};
    const ui5ObjectsDesignApiBuffer = [];

    function getApiJson(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url,
                dataType: "json"
            }).done((apiJson) => {
                resolve(apiJson);
            }).fail(() => {
                reject(`${strings.URL_GET_ERROR} ${url}`);
            });
        });
    }

    function getApiIndex() {
        const apiBaseUrl = prefs.get(constants.prefs.API_URL);
        const apiIndexPath = `${apiBaseUrl}/docs/api/api-index.json`;

        return getApiJson(apiIndexPath);
    }

    function getLibraryApi(libraryName) {
        const apiBaseUrl = prefs.get(constants.prefs.API_URL);
        const libraryApiDoc = ui5LibrariesDesignApi[libraryName];

        return new Promise((resolve, reject) => {
            if (!jQuery.isEmptyObject(libraryApiDoc)) {
                resolve(libraryApiDoc);
            } else {
                const libraryUrlName = libraryName.replace(/\./g, "/");
                const libraryApiUrl = `${apiBaseUrl}/test-resources/${libraryUrlName}/designtime/api.json`;
                getApiJson(libraryApiUrl).then((libraryApi) => {
                    resolve(libraryApi);
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    function getUi5ObjectApiDocUrl(objectFullName) {
        const apiBaseUrl = prefs.get(constants.prefs.API_URL);

        return `${apiBaseUrl}/#/api/${objectFullName}`;
    }

    function getUi5Objects() {
        if (!jQuery.isEmptyObject(ui5Objects)) {
            return ui5Objects;
        } else {
            throw new Error(strings.UI5_OBJECTS_LOAD_ERROR);
        }
    }

    function getUi5ObjectDesignApi(objectName, resultApi) {
        const ui5Object = ui5Objects[objectName];
        const libraryName = ui5Object.library;

        //no library === just namespace
        if (!libraryName) {
            return {
                kind: "namespace",
                name: objectName
            };
        }

        let objectApi;
        const bufferedDesignApi = searchObjectDesignApiBuffer(ui5Object.name);

        if (bufferedDesignApi) {
            objectApi = bufferedDesignApi;
        } else {
            const libraryApi = ui5LibrariesDesignApi[ui5Object.library];

            objectApi = libraryApi.symbols.find((element) => {
                if (element.kind === "class"
                    || element.kind === "enum") {
                    return element.name === ui5Object.name;
                } else {
                    return element.basename === ui5Object.basename;
                }
            });

            objectApi.apiDocUrl = ui5Object.apiDocUrl;
        }

        //method called recursively, we have previous result -> add new stuff
        if (resultApi) {
            if (!resultApi.inheritedApi) {
                resultApi.inheritedApi = {};
            }

            resultApi.inheritedApi[objectName] = objectApi;
        } else {
            resultApi = objectApi;
        }

        if (objectApi.extends) {
            return getUi5ObjectDesignApi(objectApi.extends, resultApi);
        } else {
            addToObjectDesignApiBuffer(resultApi);
            return resultApi;
        }
    }

    function loadUi5Objects() {
        return new Promise((resolve, reject) => {
            if (!jQuery.isEmptyObject(ui5Objects)) {
                resolve(true);
            } else {
                getApiIndex().then((apiIndexJson) => {
                    prepareUi5Objects(apiIndexJson);
                    exports.ui5Objects = ui5Objects; //unit testing only

                    console.log(`${strings.API_LOADED_INFO} ${prefs.get(constants.prefs.API_URL)}`);
                    resolve(true);
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    function loadUi5LibrariesDesignApi() {
        return new Promise((resolve, reject) => {
            for (const libraryKey in ui5LibrariesDesignApi) {
                getLibraryApi(libraryKey).then((libraryApiJson) => {
                    ui5LibrariesDesignApi[libraryKey] = libraryApiJson;
                }, (error) => {
                    reject(error);
                });

                console.log(`${strings.LIBRARY_LOADED_INFO}: ${libraryKey}`);
                resolve(true);
            }
        });
    }

    function prepareUi5Objects(apiIndexJson) {
        for (const object of apiIndexJson.symbols) {
            ui5Objects[object.name] = {
                name: object.name,
                basename: object.name.substring(object.name.lastIndexOf(".") + 1),
                kind: object.kind,
                library: object.lib,
                apiDocUrl: getUi5ObjectApiDocUrl(object.name)
            };

            //extract library
            ui5LibrariesDesignApi[object.lib] = {};
        }

    }

    function searchObjectDesignApiBuffer(objectName) {
        let result;

        if (ui5ObjectsDesignApiBuffer.length > 0) {
            result = ui5ObjectsDesignApiBuffer.find((designApi) => {
                return designApi.name === objectName;
            });
        }

        return result;
    }

    function addToObjectDesignApiBuffer(objectApi) {
        if (!searchObjectDesignApiBuffer(objectApi.name)) {
            if (ui5ObjectsDesignApiBuffer.length === ui5ObjectsDesignApiBufferLength) {
                ui5ObjectsDesignApiBuffer.shift();
            }
            ui5ObjectsDesignApiBuffer.push(objectApi);
        }
    }

    /* for unit testing only */
    exports._buffer = ui5ObjectsDesignApiBuffer;
    exports._bufferLength = ui5ObjectsDesignApiBufferLength;
    exports._searchObjectDesignApiBuffer = searchObjectDesignApiBuffer;
    exports._addToObjectDesignApiBuffer = addToObjectDesignApiBuffer;

    exports.getUi5Objects = getUi5Objects;
    exports.getUi5ObjectDesignApi = getUi5ObjectDesignApi;
    exports.getUi5ObjectApiDocUrl = getUi5ObjectApiDocUrl;
    exports.loadUi5Objects = loadUi5Objects;
    exports.loadUi5LibrariesDesignApi = loadUi5LibrariesDesignApi;
});
