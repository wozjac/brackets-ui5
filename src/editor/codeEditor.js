define((require, exports) => {
    "use strict";

    const DocumentManager = brackets.getModule("document/DocumentManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        TokenUtils = brackets.getModule("utils/TokenUtils"),
        preferences = require("src/main/preferences"),
        constants = require("src/core/constants"),
        astTool = require("src/code/astTool"),
        textTool = require("src/editor/textTool");

    function getSourceCode(document = DocumentManager.getCurrentDocument(), start, end) {
        if (!start) {
            return document.getText(false);
        } else {
            return document.getRange(start, end);
        }
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
        const sourceCode = getSourceCode(editor.document);
        const ast = astTool.parse(sourceCode);
        const endPositions = astTool.getDefineStatementPositions(ast, sourceCode);

        if (endPositions && endPositions.functionEndLocation) {
            let insertObjectPosition = {
                line: endPositions.functionEndLocation.end.line - 1,
                ch: endPositions.functionEndLocation.end.column
            };

            const objectName = ui5objectPath.substr(ui5objectPath.lastIndexOf(".") + 1);
            let insertText = objectName;

            if (endPositions.emptyFunction) {
                insertText = `${insertText}`;
            } else {
                insertText = `,${insertText}`;
            }

            editor.document.replaceRange(insertText, insertObjectPosition);
            insertObjectPosition = null;

            insertObjectPosition = {
                line: endPositions.arrayEndLocation.end.line - 1,
                ch: endPositions.arrayEndLocation.end.column
            };

            insertText = textTool.getQuote() + ui5objectPath.replace(/\./g, "/") + textTool.getQuote();

            if (endPositions.emptyArray) {
                insertText = `${insertText}`;
            } else {
                insertText = `,${insertText}`;
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
