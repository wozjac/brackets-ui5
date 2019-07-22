define((require, exports, module) => {
    "use strict";

    const ExtensionsUtil = brackets.getModule("utils/ExtensionUtils"),
        strings = require("strings"),
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
        const path = ExtensionsUtil.getModulePath(module);

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

    exports.snippet1 = require("text!./files/snippet1");
    exports.snippet2 = require("text!./files/snippet2");
    exports.snippet3 = require("text!./files/snippet3");
    exports.snippet4 = require("text!./files/snippet4");
    exports.snippet5 = require("text!./files/snippet5");
    exports.snippet6 = require("text!./files/snippet6");
    exports.snippet7 = require("text!./files/snippet7");
    exports.snippet8 = require("text!./files/snippet8");

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
