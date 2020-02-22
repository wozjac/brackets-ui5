define((require, exports) => {
    "use strict";

    const prefs = require("src/main/preferences"),
        constants = require("src/core/constants");

    function addSubmatches(matchValues, text) {
        if (matchValues && Array.isArray(matchValues[0])) {
            for (const match of matchValues) {
                match[0] = {
                    text: match[0],
                    pos: match.index
                };

                for (let i = 1; i < match.length; i++) {
                    match[i] = {
                        text: match[i],
                        pos: text.indexOf(match[i], match[0].pos)
                    };
                }
            }
        } else {
            matchValues[0] = {
                text: matchValues[0],
                pos: matchValues.index
            };

            for (let i = 1; i < matchValues.length; i++) {
                matchValues[i] = {
                    text: matchValues[i],
                    pos: text.indexOf(matchValues[i], matchValues[0].pos)
                };
            }
        }
    }

    function getQuote() {
        const option = prefs.get(constants.prefs.USE_SINGLE_QUOTES);
        if (option === true) {
            return "'";
        } else {
            return "\"";
        }
    }

    function lineNumberByIndex(index, text) {
        let line = -1,
            match;
        const re = /(^)[\S\s]/gm;
        while ((match = re.exec(text))) {
            if (match.index > index) {
                break;
            }
            line++;
        }
        return line;
    }

    function getIndexFromPosition(text, position) {
        const lines = text.split("\n");
        let index = 0;

        if (position.line === 0) {
            return position.ch;
        }

        for (let i = 0; i < lines.length; i++) {
            if (i === position.line) {
                index += position.ch;
                return index;
            } else {
                index += lines[i].length + 1;
            }
        }
    }

    exports.addSubmatches = addSubmatches;
    exports.getQuote = getQuote;
    exports.lineNumberByIndex = lineNumberByIndex;
    exports.getIndexFromPosition = getIndexFromPosition;
});
