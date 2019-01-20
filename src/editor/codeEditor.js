define((require, exports) => {
    "use strict";

    const DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        TokenUtils = brackets.getModule("utils/TokenUtils"),
        preferences = require("src/main/preferences"),
        constants = require("src/core/constants"),
        textTool = require("src/editor/textTool");

    function getSourceCode(document = DocumentManager.getCurrentDocument()) {
        return document.getText(false);
    }

    function getSourceCodeAtLine(lineNumber, document = DocumentManager.getCurrentDocument()) {
        return document.getLine(lineNumber);
    }

    function getToken(position, editor = EditorManager.getCurrentFullEditor()) {
        const cm = editor._codeMirror;

        return TokenUtils.getTokenAt(cm, position);
    }

    function formatJsDoc(jsDoc, cleanHtml = false) {
        if (!jsDoc) {
            return "";
        }

        jsDoc = jsDoc
            .replace(/{@\w+/g, "")
            .replace(/}/g, "")
            .replace(/#\w+/g, "")
            .replace(/\s\s+/g, " ");
        //.replace(/#\w+:?\w+/g, "");

        if (cleanHtml) {
            jsDoc = jsDoc.replace(constants.regex.htmlTags, "");
        } else {
            //leave only headers and adjust
            jsDoc = jsDoc.replace(constants.regex.htmlTagsWoHeaders, "");
            jsDoc = jsDoc
                .replace(constants.regex.headingsTags, "$1" + "5" + "$3")
                .replace(constants.regex.tagsAttributes, "<$1>");
        }

        return jsDoc;
    }

    function insertAtPosition(ui5objectPath, editor = EditorManager.getCurrentFullEditor()) {
        const position = editor.getCursorPos();

        if (preferences.get(constants.prefs.OBJECT_IN_QUOTES) === true) {
            ui5objectPath = textTool.getQuote() + ui5objectPath + textTool.getQuote();
        }

        editor.document.replaceRange(ui5objectPath, position);
    }

    function insertInDefine(ui5objectPath, editor = EditorManager.getCurrentFullEditor()) {
        let regexp = constants.regex.defineStatement,
            text = getSourceCode(editor.document),
            match = regexp.exec(text);

        if (match === null) {
            regexp = constants.regex.defineES6Statement;
            match = regexp.exec(text);
        }

        if (match === null) {
            regexp = constants.regex.requireStatement;
            match = regexp.exec(text);
        }

        if (match === null) {
            regexp = constants.regex.requireES6Statement;
            match = regexp.exec(text);
        }

        if (match) {
            textTool.addSubmatches(match, text, regexp);

            const params = match[3].text.trim();

            /* define array content */
            const arrayClosingBracketIndex = match[2].pos;
            let string = text.substr(0, arrayClosingBracketIndex + 1),
                lines = string.split("\n");

            let insertObjectPosition = {
                line: lines.length - 1,
                ch: lines[lines.length - 1].indexOf("]")
            };

            let insertText = textTool.getQuote() + ui5objectPath.replace(/\./g, "/") + textTool.getQuote();

            if (match[1].text.trim().length > 0) {
                if (insertObjectPosition.ch === 0) {
                    editor.document.replaceRange(",", {
                        line: insertObjectPosition.line - 1,
                        ch: lines[insertObjectPosition.line - 1].length
                    });
                } else {
                    insertText = `,${insertText}`;
                }
            }

            editor.document.replaceRange(insertText, insertObjectPosition);

            insertObjectPosition = null;

            /* function parameter */
            text = editor.document.getText(false);
            match = regexp.exec(text);
            textTool.addSubmatches(match, text, regexp);
            const functionClosingBracketIndex = match[4].pos;
            string = text.substr(0, functionClosingBracketIndex + 1);
            lines = string.split("\n");

            insertObjectPosition = {
                line: lines.length - 1,
                ch: lines[lines.length - 1].indexOf(")")
            };

            const objectName = ui5objectPath.substr(ui5objectPath.lastIndexOf(".") + 1);
            insertText = objectName;

            //const params = defineMatch[3].text.trim().match(/\(([^()).]*)\)/);
            if (params && params.trim().length > 0) {
                if (insertObjectPosition.ch === 0) {
                    editor.document.replaceRange(",", {
                        line: insertObjectPosition.line - 1,
                        ch: lines[insertObjectPosition.line - 1].length
                    });
                } else {
                    insertText = `,${insertText}`;
                }
            }

            editor.document.replaceRange(insertText, insertObjectPosition);

            if (preferences.get(constants.prefs.INSERT_OBJECT_IN_DEFINE) === true) {
                editor.document.replaceRange(objectName, editor.getCursorPos());
            }
        }
    }

    function insertWithSlash(ui5objectPath, editor = EditorManager.getCurrentFullEditor()) {
        insertAtPosition(ui5objectPath.replace(/\./g, "/"), editor);
    }

    exports.insertAtPosition = insertAtPosition;
    exports.insertInDefine = insertInDefine;
    exports.insertWithSlash = insertWithSlash;
    exports.getToken = getToken;
    exports.getSourceCode = getSourceCode;
    exports.getSourceCodeAtLine = getSourceCodeAtLine;
    exports.formatJsDoc = formatJsDoc;
});
