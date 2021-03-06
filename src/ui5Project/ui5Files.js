define((require, exports) => {
    "use strict";

    const ProjectManager = brackets.getModule("project/ProjectManager"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Commands = brackets.getModule("command/Commands"),
        xmlExtract = require("src/code/xmlExtract"),
        strings = require("strings");

    const distFolder = "dist/";
    const nodeModules = "node_modules/";

    function getI18nModelInfo() {
        const promise = new Promise((resolve, reject) => {
            function manifestFound(manifestFile) {
                const models = manifestFile.content["sap.ui5"].models;
                const i18nModel = _findModel("type", "sap.ui.model.resource.ResourceModel", models, manifestFile);

                if (i18nModel) {
                    resolve(i18nModel);
                } else {
                    reject(`${strings.PREFIX} i18n ${strings.MODEL_DEFINITION_NOT_FOUND}`);
                }
            }

            function manifestNotFound(error) {
                reject(error);
            }

            getManifestFile().then(manifestFound, manifestNotFound);
        });

        return promise;
    }

    function getModelInfo(modelName) {
        const promise = new Promise((resolve, reject) => {
            function manifestFound(manifestFile) {
                const models = manifestFile.content["sap.ui5"].models;
                const model = _findModel("name", modelName, models, manifestFile);

                if (model) {
                    resolve(model);
                } else {
                    reject(`${modelName} ${strings.MODEL_DEFINITION_NOT_FOUND}`);
                }
            }

            function manifestNotFound(error) {
                resolve(error);
            }

            getManifestFile().then(manifestFound, manifestNotFound);
        });

        return promise;
    }

    function getComponentId(manifestContent) {
        let id;

        try {
            id = manifestContent["sap.app"].id;
        } catch (error) {
            id = null;
        }

        return id;
    }

    function getResourceRootPaths(indexFile, manifestFile) {
        let result;

        if (indexFile) {
            result = _getResourcePathsFromIndex(indexFile);
        } else {
            try {
                result = {};
                const id = manifestFile.content["sap.app"].id;
                result[id] = manifestFile.path;
            } catch (error) {
                result = null;
            }
        }

        return result;
    }

    function getIndexFile() {
        return findFile("index.html");
    }

    function getManifestFile() {
        return new Promise((resolve, reject) => {
            try {
                findFile("manifest.json").then((file) => {
                    file.content = JSON.parse(file.content);
                    resolve(file);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    function getControllerFile(controllerName) {
        if (controllerName.search(new RegExp(`${controllerName}.controller.js`)) === -1) {
            controllerName += ".controller.js";
        }

        return findFile(controllerName);
    }

    function findFiles(filenameRegex) {
        return new Promise((resolve, reject) => {
            ProjectManager.getAllFiles((file) => {
                    return filenameRegex.test(file.name)
                        && file.fullPath.indexOf(distFolder) === -1
                        && file.fullPath.indexOf(nodeModules) === -1;
                })
                .done((files) => {
                    resolve(files);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    }

    function findFile(filename) {
        return new Promise((resolve, reject) => {
            ProjectManager.getAllFiles((file) => {
                    return file.name === filename
                        && file.fullPath.indexOf(distFolder) === -1
                        && file.fullPath.indexOf(nodeModules) === -1;
                }).done((files) => {
                    if (files && files.length === 1) {
                        files[0].read((error, content) => {
                            if (error) {
                                reject(error);
                            }

                            resolve({
                                content,
                                path: files[0].parentPath,
                                file: files[0]
                            });
                        });
                    } else {
                        reject(`${strings.FILE_NOT_FOUND}`);
                    }
                })
                .fail(() => {
                    reject(`${strings.FILE_NOT_FOUND}`);
                });
        });
    }

    function findXmlViewsControllers() {
        return new Promise((resolve, reject) => {
            ProjectManager.getAllFiles((file) => {
                    return file.name.search(/.*\.view\.xml/) !== -1
                        && file.fullPath.indexOf(nodeModules) === -1
                        && file.fullPath.indexOf(distFolder) === -1;
                }).done((files) => {
                    const promises = [];

                    for (const file of files) {
                        const promise = new Promise((resolve, reject) => {
                            _readFile(file).then((content) => {
                                const controllerId = xmlExtract.getControllerName(content, true);

                                resolve({
                                    controllerId,
                                    viewName: file.name,
                                    content
                                });

                            }, (error) => {
                                reject(error);
                            });
                        });

                        promises.push(promise);
                    }

                    resolve(Promise.all(promises));
                })
                .fail(() => {
                    reject(`${strings.FILE_NOT_FOUND}`);
                });
        });
    }

    function openFile(path) {
        return new Promise((resolve, reject) => {
            CommandManager.execute(Commands.FILE_OPEN, {
                    fullPath: path
                })
                .done((document) => {
                    resolve(document);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    }

    function _readFile(file) {
        return new Promise((resolve, reject) => {
            file.read((error, content) => {
                if (error) {
                    reject(error);
                }

                resolve(content);
            });
        });
    }

    function _findModel(property, value, models, manifestFile) {
        let modelInfo, foundModel;

        for (const model in models) {
            if (property === "name") {
                if (model === value) {
                    foundModel = models[model];
                }
            } else if (model[property] === value) {
                foundModel = models[model];
            }

            if (foundModel) {
                if (models[model].type === "sap.ui.model.resource.ResourceModel") {
                    modelInfo = {
                        type: "i18n",
                        name: model,
                        path: _getI18nFilePath(models[model], manifestFile)
                    };
                }

                return modelInfo;
            }
        }

        return modelInfo;
    }

    function _getI18nFilePath(modelEntry, manifestFile) {
        if (modelEntry.uri) {
            return `${manifestFile.path}/${modelEntry.uri}`;
        } else if (modelEntry.settings.bundleName) {
            //get manifest path
            try {
                const mainPath = manifestFile.content["sap.app"].id;
                let bundlePath = modelEntry.settings.bundleName.replace(mainPath, "").replace(/\./g, "/");

                if (bundlePath.startsWith("/")) {
                    bundlePath = bundlePath.slice(1);
                }

                return `${manifestFile.path}${bundlePath}.properties`;
            } catch (error) {
                return null;
            }
        }
    }

    function _getResourcePathsFromIndex(indexContent) {
        const regex = /data-sap-ui-resourceroots=['"]{1}\{(.*)\}/gmi;
        const match = regex.exec(indexContent);

        let result;

        if (match && match[1]) {
            const parts = match[1].split(",");
            parts.forEach((part) => {
                const path = part.split(":");

                if (path) {
                    if (!result) {
                        result = {};
                    }

                    result[path[0].replace(/['"]/g, "").trim()] = path[1].replace(/['"]/g, "").trim();
                }
            });
        }

        return result;
    }

    exports._projectManager = ProjectManager; //unit testing only
    exports.getManifestFile = getManifestFile;
    exports.getIndexFile = getIndexFile;
    exports.getControllerFile = getControllerFile;
    exports.getI18nModelInfo = getI18nModelInfo;
    exports.getModelInfo = getModelInfo;
    exports.getComponentId = getComponentId;
    exports.getResourceRootPaths = getResourceRootPaths;
    exports.findFile = findFile;
    exports.findFiles = findFiles;
    exports.openFile = openFile;
    exports.findXmlViewsControllers = findXmlViewsControllers;
});
