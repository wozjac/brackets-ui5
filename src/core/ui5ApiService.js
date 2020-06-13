define((require, exports) => {
    "use strict";

    const constants = require("src/core/constants"),
        strings = require("strings"),
        ui5TernDefinitions = require("src/code/ui5TernDefinitions"),
        prefs = require("src/main/preferences");

    const ui5ObjectsDesignApiBufferLength = 30;
    const ui5Objects = {};
    const ui5LibrariesDesignApi = {};
    const ui5ObjectsDesignApiBuffer = [];

    const sapLibraryDefs = {
        "!name": "sap"
    };

    const requireJsOverrides = {};

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

        let path = objectFullName;

        if (path.indexOf("module:") !== -1) {
            path = encodeURIComponent(path);
        }

        return `${apiBaseUrl}/#/api/${path}`;
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

            if (!objectApi) {
                return;
            }

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
        if (!jQuery.isEmptyObject(ui5Objects)) {
            return Promise.resolve(true);
        } else {
            return getApiIndex()
                .then((apiIndexJson) => {
                    prepareUi5Objects(apiIndexJson);
                    exports.ui5Objects = ui5Objects; //unit testing only
                    console.log(`${strings.API_LOADED_INFO} ${prefs.get(constants.prefs.API_URL)}`);
                    Promise.resolve(true);
                }, (error) => {
                    Promise.reject(error);
                });
        }
    }

    function loadUi5LibrariesDesignApi() {
        const promises = [];

        for (const libraryKey in ui5LibrariesDesignApi) {
            promises.push(new Promise((resolve) => {
                getLibraryApi(libraryKey)
                    .then((libraryApiJson) => {
                        if (libraryApiJson.symbols && Array.isArray(libraryApiJson.symbols)) {
                            libraryApiJson.symbols.forEach((element) => {
                                element.name = getNormalizedName(element.name);
                                element.originalName = element.name;
                                element.apiDocUrl = getUi5ObjectApiDocUrl(element.name);
                            });
                        }

                        ui5LibrariesDesignApi[libraryKey] = libraryApiJson;
                        prepareDefinitions(libraryKey);
                        console.log(`${strings.LIBRARY_LOADED_INFO}: ${libraryKey}`);
                        resolve();
                    })
                    .catch((error) => {
                        //continue, no rejections
                        console.error(`[wozjac.ui5] ${error}`);
                        return;
                    });
            }));
        }

        return Promise.all(promises);
    }

    function prepareUi5Objects(apiEntry) {
        let normalizedName;

        if (apiEntry.symbols) {
            for (const object of apiEntry.symbols) {
                normalizedName = getNormalizedName(object.name);
                ui5Objects[normalizedName] = getEntry(object);

                //extract library
                ui5LibrariesDesignApi[object.lib] = {};

                if (object.nodes) {
                    for (const node of object.nodes) {
                        prepareUi5Objects(node);
                    }
                }
            }
        } else {
            normalizedName = getNormalizedName(apiEntry.name);
            ui5Objects[normalizedName] = getEntry(apiEntry);
            ui5LibrariesDesignApi[apiEntry.lib] = {};

            if (apiEntry.nodes) {
                for (const node of apiEntry.nodes) {
                    prepareUi5Objects(node);
                }
            }
        }
    }

    function getEntry(apiIndexObject) {
        return {
            name: getNormalizedName(apiIndexObject.name),
            originalName: apiIndexObject.name,
            basename: apiIndexObject.name.substring(apiIndexObject.name.lastIndexOf(".") + 1),
            kind: apiIndexObject.kind,
            library: apiIndexObject.lib,
            apiDocUrl: getUi5ObjectApiDocUrl(apiIndexObject.name)
        };
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

    function prepareDefinitions(libraryKey) {
        const library = ui5LibrariesDesignApi[libraryKey];

        for (const symbol of library.symbols) {
            requireJsOverrides[symbol.name.replace(/\./g, "/")] = `=${symbol.name}`;
            const nameParts = symbol.name.split(".");
            let objectRef = sapLibraryDefs;

            for (const [index, namePart] of nameParts.entries()) {
                if (!objectRef[namePart]) {
                    objectRef[namePart] = {};
                }

                objectRef = objectRef[namePart];

                if (index === nameParts.length - 1) {
                    ui5TernDefinitions.prepareUi5Symbol(objectRef, symbol);
                }
            }
        }
    }

    function getNormalizedName(name) {
        return name
            .replace("module:", "")
            .replace(/\//g, ".");
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
    exports.prepareDefinitions = prepareDefinitions;
    exports.sapLibraryDefinitions = sapLibraryDefs;
    exports.requirejsOverrides = requireJsOverrides;
    exports.getNormalizedName = getNormalizedName;
});
