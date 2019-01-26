define((require, exports) => {
    "use strict";

    const MultiRangeInlineEditor = brackets.getModule("editor/MultiRangeInlineEditor").MultiRangeInlineEditor,
        DocumentManager = brackets.getModule("document/DocumentManager"),
        StringUtils = brackets.getModule("utils/StringUtils"),
        ui5Files = require("src/ui5Project/ui5Files");

    function inlineEditProvider(hostEditor) {
        if (hostEditor.getModeForSelection() !== "xml") {
            return null;
        }

        const selection = hostEditor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        const i18nInfo = _getI18nInfoFromAttribute(hostEditor, selection.start);

        if (!i18nInfo) {
            return null;
        }

        const result = new $.Deferred();
        let i18nDocument;

        ui5Files.getModelInfo(i18nInfo.modelName).then((modelInfo) => {
            return DocumentManager.getDocumentForPath(modelInfo.path);
        }).then((document) => {
            i18nDocument = document;
            return _getEntryRange(i18nInfo, i18nDocument);
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

    function _getEntryRange(i18nInfo, i18nDocument) {
        return new Promise((resolve) => {
            const rangeInfo = _getEntryStartEnd(i18nInfo.key, i18nDocument);

            if (!rangeInfo) {
                resolve(null);
            }

            resolve({
                document: i18nDocument,
                name: i18nInfo.key,
                lineStart: rangeInfo.startLine,
                lineEnd: rangeInfo.endLine
            });
        });
    }

    function _getI18nInfoFromAttribute(hostEditor, position) {
        const token = hostEditor._codeMirror.getTokenAt(position, true),
            value = token.string.replace(/['"{}]/g, "");

        const parts = value.split(">");

        if (parts.length !== 2) {
            return null;
        }

        return {
            modelName: parts[0],
            key: parts[1]
        };
    }

    function _getEntryStartEnd(key, document) {
        const text = document.getText(),
            lines = StringUtils.getLines(text),
            regex = new RegExp(`^${key}\\s*=`, "gm");

        const match = regex.exec(text);

        if (match) {
            const startLine = StringUtils.offsetToLineNum(lines, match.index);
            const nextKeyRegex = /^[\w.]+\s*=/gm;
            nextKeyRegex.lastIndex = regex.lastIndex;
            const nextKeyMatch = nextKeyRegex.exec(text);

            let endLine;

            if (nextKeyMatch) {
                endLine = StringUtils.offsetToLineNum(lines, nextKeyMatch.index) - 1;
            } else {
                endLine = lines.length - 1;
            }

            return {
                startLine,
                endLine
            };
        } else {
            return null;
        }
    }

    //function _insertNewEntry(key, i18nDocument) {
    //    const docLines = i18nDocument.getText().split("\n"),
    //        lastDocLine = docLines.length - 1,
    //        lastDocChar = docLines[docLines.length - 1].length,
    //        entryLine = lastDocLine + 1;
    //
    //    const newEntry = `${key}=`;
    //
    //    i18nDocument.replaceRange(newEntry, {
    //        line: entryLine,
    //        ch: lastDocChar
    //    });
    //
    //    return {
    //        range: {
    //            from: {
    //                line: entryLine,
    //                ch: 0
    //            },
    //            to: {
    //                line: entryLine,
    //                ch: newEntry.length + 1
    //            }
    //        },
    //        pos: {
    //            line: entryLine,
    //            ch: newEntry + 1
    //        }
    //    };
    //}

    exports.getInlineEditProvider = inlineEditProvider;
});
