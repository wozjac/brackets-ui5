define((require, exports) => {
    "use strict";

    const MultiRangeInlineEditor = brackets.getModule("editor/MultiRangeInlineEditor").MultiRangeInlineEditor,
        DocumentManager = brackets.getModule("document/DocumentManager"),
        StringUtils = brackets.getModule("utils/StringUtils"),
        i18nTool = require("src/code/i18nTool"),
        ui5Files = require("src/ui5Project/ui5Files");

    function inlineEditProvider(hostEditor) {
        if (hostEditor.getModeForSelection() !== "xml") {
            return null;
        }

        const selection = hostEditor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        const i18nInfo = i18nTool.getI18nInfoFromAttribute(hostEditor, selection.start);

        if (!i18nInfo) {
            return null;
        }

        const result = new $.Deferred();
        let i18nDocument;

        ui5Files.getModelInfo(i18nInfo.modelName).then((modelInfo) => {
            return DocumentManager.getDocumentForPath(modelInfo.path);
        }).then((document) => {
            i18nDocument = document;
            return i18nTool.getEntryRange(i18nInfo, i18nDocument);
        }).then((rangeInfo) => {
            let inlineEditor;

            if (rangeInfo) {
                inlineEditor = new MultiRangeInlineEditor([rangeInfo]);
                inlineEditor.load(hostEditor);
                result.resolve(inlineEditor);
            } else {
                //no entry found, create one
                const newEntry = _createNewEntry(i18nInfo, i18nDocument);

                inlineEditor = new MultiRangeInlineEditor([{
                    document: i18nDocument,
                    name: "newEntry",
                    lineStart: newEntry.range.from.line,
                    lineEnd: newEntry.range.to.line
                }]);

                inlineEditor.load(hostEditor);

                //inlineEditor.addAndSelectRange(
                //    newEntry.newEntryText,
                //    i18nDocument,
                //    newEntry.range.from.line,
                //    newEntry.range.to.line);

                inlineEditor.editor.setCursorPos(newEntry.pos.line, newEntry.pos.ch);
                result.resolve(inlineEditor);
            }

        }).catch((error) => {
            result.reject();
            console.log(error);
        });

        return result.promise();
    }

    function _createNewEntry(i18nInfo, i18nDocument) {
        const lines = StringUtils.getLines(i18nDocument.getText()),
            lastDocLine = lines.length - 1,
            lastDocChar = lines[lines.length - 1].length,
            newEntryText = `\n${i18nInfo.key}=`;

        i18nDocument.replaceRange(newEntryText, {
            line: lastDocLine,
            ch: lastDocChar
        });

        return {
            newEntryText: `${i18nInfo.key}=`,
            range: {
                from: {
                    line: lastDocLine + 1,
                    ch: 0
                },
                to: {
                    line: lastDocLine + 1,
                    ch: 0
                },
            },
            pos: {
                line: lastDocLine + 1,
                ch: newEntryText.length + 1
            }
        };
    }

    exports.inlineEditProvider = inlineEditProvider;
});
