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

        _getEntryRange(i18nInfo).then((rangeInfo) => {
            const inlineEditor = new MultiRangeInlineEditor([rangeInfo]);
            inlineEditor.load(hostEditor);
            result.resolve(inlineEditor);
        }, () => {
            result.reject();
        });

        return result.promise();
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

    function _getEntryRange(i18nInfo) {
        return new Promise((resolve, reject) => {
            ui5Files.getModelInfo(i18nInfo.modelName).then((modelInfo) => {
                DocumentManager.getDocumentForPath(modelInfo.path).then((i18nDocument) => {
                    const rangeInfo = _getEntryStartEnd(i18nInfo.key, i18nDocument);

                    if (!rangeInfo) {
                        reject();
                    } else {
                        resolve({
                            document: i18nDocument,
                            name: i18nInfo.key,
                            lineStart: rangeInfo.startLine,
                            lineEnd: rangeInfo.endLine
                        });
                    }
                }, () => {
                    reject();
                });
            }, () => {
                reject();
            });
        });
    }

    //function _addNewEntry() {
    //    const newEntry = _addNewEntry(i18nInfo.key, i18nDocument);
    //    inlineEditor.addAndSelectRange(selectorName, styleDoc, newRuleInfo.range.from.line, newRuleInfo.range.to.line);
    //    inlineEditor.editor.setCursorPos(newRuleInfo.pos.line, newRuleInfo.pos.ch);
    //
    //
    //    rangeInfo = {};
    //
    //
    //    rangeInfo.startLine = newEntry.range.startLine;
    //    rangeInfo.endLine = newEntry.range.endLine;
    //}

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
