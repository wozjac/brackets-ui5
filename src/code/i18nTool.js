define((require, exports) => {

    const StringUtils = brackets.getModule("utils/StringUtils");

    function getEntryStartEnd(key, document) {
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

    function getEntryRange(i18nInfo, i18nDocument) {
        return new Promise((resolve) => {
            const rangeInfo = getEntryStartEnd(i18nInfo.key, i18nDocument);

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

    function getI18nInfoFromAttribute(editor, position) {
        const token = editor._codeMirror.getTokenAt(position, true),
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

    exports.getI18nInfoFromAttribute = getI18nInfoFromAttribute;
    exports.getEntryRange = getEntryRange;
    exports.getEntryStartEnd = getEntryStartEnd;
});
