define((require, exports) => {
    "use strict";

    const ProjectManager = brackets.getModule("project/ProjectManager"),
        strings = require("strings");

    function getManifestFile() {
        return new Promise((resolve, reject) => {
            ProjectManager.getAllFiles((file) => {
                return file.name === "manifest.json";
            }).then((files) => {
                if (files && files.length === 1) {
                    files[0].read((error, content) => {
                        if (error) {
                            reject(error);
                        }

                        resolve({
                            content: JSON.parse(content),
                            path: files[0].parentPath
                        });
                    });
                } else {
                    reject(strings.MANIFEST_FILE_NOT_FOUND);
                }
            }, () => {
                reject(strings.MANIFEST_FILE_NOT_FOUND);
            });
        });
    }

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
        const projectPath = ProjectManager.getProjectRoot().fullPath;

        if (modelEntry.uri) {
            return `${projectPath}${modelEntry.uri}`;
        } else if (modelEntry.settings.bundleName) {
            //get manifest path
            const mainPath = manifestFile.content["sap.app"].id;
            let bundlePath = modelEntry.settings.bundleName.replace(mainPath, "").replace(/\./g, "/");

            if (bundlePath.startsWith("/")) {
                bundlePath = bundlePath.slice(1);
            }

            return `${manifestFile.path}${bundlePath}.properties`;
        }
    }

    exports._projectManager = ProjectManager; //unit testing only
    exports.getManifestFile = getManifestFile;
    exports.getI18nModelInfo = getI18nModelInfo;
    exports.getModelInfo = getModelInfo;
});
