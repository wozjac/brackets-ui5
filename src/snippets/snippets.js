define((require, exports, module) => {
    "use strict";

    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        strings = require("strings"),
        fileLoader = require("src/main/fileLoader"),
        codeEditor = require("src/editor/codeEditor");

    function insertSnippet(snippet) {
        return function (editor) {
            const firstNewline = snippet.indexOf("\n");

            if (firstNewline !== -1) {
                const snippetText = snippet.substring(firstNewline + 1);
                codeEditor.insertAtPosition(snippetText, editor);
            }
        };
    }

    function openSnippetsFolder() {
        const path = ExtensionUtils.getModulePath(module);

        brackets.app.showOSFolder(`${path}/files`, (error) => {
            if (error) {
                console.error(`[wozjac.ui5]: ${strings.OPEN_TEMPL_DIR_ERROR}`, error);
            }
        });
    }

    function getSnippetTitle(number) {
        const snippetText = exports[`snippet${number}`];
        let title = `snippet ${number}`;

        try {
            const snippetTitle = snippetText.split(/[\r\n]/)[0].replace("//", "").trim();

            if (snippetTitle.length > 0) {
                title = snippetTitle;
            }
        } catch (error) {
            return title;
        }

        return title;
    }

    function _readSnippetContent(number) {
        let result = "";

        try {
            result = fileLoader.readTextFileSync(module, `files/snippet${number}`);
        } catch (error) {
            result = `<< Snippet${number}>> file not found`;
        }

        return result;
    }

    for (let i = 1; i <= 8; i++) {
        exports[`snippet${i}`] = _readSnippetContent(i);
    }

    exports.insertSnippet1 = insertSnippet(exports.snippet1);
    exports.insertSnippet2 = insertSnippet(exports.snippet2);
    exports.insertSnippet3 = insertSnippet(exports.snippet3);
    exports.insertSnippet4 = insertSnippet(exports.snippet4);
    exports.insertSnippet5 = insertSnippet(exports.snippet5);
    exports.insertSnippet6 = insertSnippet(exports.snippet6);
    exports.insertSnippet7 = insertSnippet(exports.snippet7);
    exports.insertSnippet8 = insertSnippet(exports.snippet8);

    exports.openSnippetsFolder = openSnippetsFolder;
    exports.getSnippetTitle = getSnippetTitle;
});
