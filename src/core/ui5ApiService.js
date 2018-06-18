define((require, exports) => {
    "use strict";

    const ui5ApiFinder = require("src/core/ui5ApiFinder"),
        constants = require("src/core/constants"),
        strings = require("strings"),
        prefs = require("src/main/preferences");

    const ui5ObjectsDesignApiBufferLength = 30;

    let ui5Objects = [],
        apiIndex;

    const ui5ObjectsDesignApiBuffer = [];

    function loadUi5Objects() {
        return new Promise((resolve, reject) => {
            if (ui5Objects.length > 0) {
                resolve(true);
            } else {
                const apiUrl = prefs.get(constants.prefs.API_URL);
                const apiPath = `${apiUrl}/docs/api/index.xml`;

                $.ajax({
                    type: "GET",
                    url: apiPath,
                    dataType: "xml"
                }).done((xml) => {
                    ui5Objects = [];
                    $(xml).find("namespace").each(function () {
                        ui5Objects.push({
                            path: $(this).children("alias").text(),
                            name: $(this).children("name").text(),
                            deprecated: $(this).children("deprecated").text() ? true : false,
                            apiUrl: `${apiUrl}/#docs/api/${$(this).children("ref").text()}`
                        });
                    });
                    console.info(`${strings.API_LOADED_INFO} ${apiUrl}`);
                    exports.ui5Objects = ui5Objects; //unit testing only
                    resolve(true);
                }).fail(() => {
                    reject(`${strings.URL_GET_ERROR} ${apiUrl}`);
                });
            }
        });
    }

    function loadUi5ApiIndex() {
        return new Promise((resolve, reject) => {
            if (apiIndex) {
                resolve(true);
            } else {
                const baseUrl = prefs.get(constants.prefs.API_URL);
                const url = `${baseUrl}/docs/api/api-index.json`;

                $.ajax({
                    type: "GET",
                    url,
                    dataType: "json"
                }).done((api) => {
                    apiIndex = api;
                    exports._apiIndex = apiIndex; //unit testing only
                    resolve(true);
                }).fail(() => {
                    reject(`${strings.URL_GET_ERROR} ${baseUrl}`);
                });
            }
        });
    }

    function getUi5Objects() {
        if (ui5Objects.length > 0) {
            return ui5Objects;
        } else {
            throw new Error(strings.UI5_OBJECTS_LOAD_ERROR);
        }
    }

    function getUi5ApiIndex() {
        if (apiIndex) {
            return apiIndex;
        } else {
            throw new Error(strings.UI5_OBJECTS_LOAD_ERROR);
        }
    }

    function searchDesignApiBuffer(path) {
        let result;

        if (ui5ObjectsDesignApiBuffer.length > 0) {
            result = ui5ObjectsDesignApiBuffer.find((designApi) => {
                return designApi.name === path;
            });
        }

        return result;
    }

    function addToDesignApiBuffer(objectApi) {
        if (!searchDesignApiBuffer(objectApi.name)) {
            if (ui5ObjectsDesignApiBuffer.length === ui5ObjectsDesignApiBufferLength) {
                ui5ObjectsDesignApiBuffer.shift();
            }
            ui5ObjectsDesignApiBuffer.push(objectApi);
        }
    }

    function getUi5ObjectDesignApi(ui5ObjectPath) {
        return new Promise((resolve, reject) => {
            const apiBaseUrl = prefs.get(constants.prefs.API_URL);
            const libraryName = ui5ApiFinder.findUi5Library(ui5ObjectPath);

            //no library === just namespace
            if (!libraryName) {
                resolve({
                    kind: "namespace",
                    name: ui5ObjectPath
                });

                return;
            }

            const ui5objectName = ui5ObjectPath.replace(/\./g, "/").substr(ui5ObjectPath.lastIndexOf(".") + 1);
            const apiDocUrl = `${apiBaseUrl}/#docs/api/symbols/${ui5ObjectPath}.html`;
            const apiUrl = `${apiBaseUrl}/test-resources/${libraryName}/designtime/api.json`;

            const bufferedDesignApi = searchDesignApiBuffer(ui5ObjectPath);
            if (bufferedDesignApi) {
                resolve(bufferedDesignApi);
            } else {
                $.ajax({
                    type: "GET",
                    url: apiUrl,
                    dataType: "json"
                }).done((api) => {
                    const objectApi = api.symbols.find((element) => {
                        if (element.kind === "class") {
                            return element.name === ui5ObjectPath;
                        } else {
                            return element.basename === ui5objectName;
                        }
                    });
                    objectApi.apiDocUrl = apiDocUrl;
                    addToDesignApiBuffer(objectApi);
                    resolve(objectApi);
                }).error((err) => {
                    reject(err);
                });
            }
        });
    }

    /* for unit testing only */
    exports._buffer = ui5ObjectsDesignApiBuffer;
    exports._bufferLength = ui5ObjectsDesignApiBufferLength;
    exports._searchDesignApiBuffer = searchDesignApiBuffer;
    exports._addToDesignApiBuffer = addToDesignApiBuffer;

    exports.getUi5Objects = getUi5Objects;
    exports.getUi5ObjectDesignApi = getUi5ObjectDesignApi;
    exports.getUi5ApiIndex = getUi5ApiIndex;
    exports.loadUi5Objects = loadUi5Objects;
    exports.loadUi5ApiIndex = loadUi5ApiIndex;
});
