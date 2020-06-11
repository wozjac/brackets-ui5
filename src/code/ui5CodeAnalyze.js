define((require, exports) => {
    "use strict";

    const EditorManager = brackets.getModule("editor/EditorManager"),
        ui5TernBase = require("src/code/ui5TernBase");

    function getUi5Type(editor = EditorManager.getActiveEditor()) {
        return new Promise((resolve, reject) => {
            if (!editor || !editor.document) {
                resolve(null);
            }

            ui5TernBase.addFileToTern(editor.document)
                .then(() => {
                    return ui5TernBase.getUi5Type({
                        filename: editor.document.file.fullPath,
                        offset: editor.getCursorPos()
                    });
                })
                .then((ternResponse) => {
                    if (ternResponse && ternResponse.data && ternResponse.data.name) {
                        resolve(ternResponse.data);
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    console.error(`[wozjac.ui5] ${error}`);
                    reject();
                });
        });
    }

    function getUi5Hints(editor = EditorManager.getActiveEditor()) {
        return new Promise((resolve, reject) => {
            if (!editor || !editor.document) {
                resolve(null);
            }

            ui5TernBase.addFileToTern(editor.document)
                .then(() => {
                    return ui5TernBase.getTernHints({
                        filename: editor.document.file.fullPath,
                        offset: editor.getCursorPos()
                    });
                })
                .then((ternResponse) => {
                    if (ternResponse && ternResponse.completions && ternResponse.completions.length > 0) {
                        resolve(ternResponse.completions);
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                });
        });
    }

    exports.getUi5Type = getUi5Type;
    exports.getUi5Hints = getUi5Hints;
});
