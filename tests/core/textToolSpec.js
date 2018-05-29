define((require, exports) => {
    "use strict";

    const textTool = require("src/editor/textTool"),
        constants = require("src/core/constants"),
        prefs = require("src/main/preferences");

    exports.getTests = function () {
        describe("[wozjac.ui5] textTool.js", () => {
            it("Shoult return the correct line number", () => {
                let text = "Line 1 \n ...line 2\n and the last one!";
                let result = textTool.lineNumberByIndex(10, text);
                expect(result).toBe(1);

                text = "0\n1";
                result = textTool.lineNumberByIndex(3, text);
                expect(result).toBe(1);

                text = "0\n1";
                result = textTool.lineNumberByIndex(0, text);
                expect(result).toBe(0);

                text = "0\n1";
                result = textTool.lineNumberByIndex(1, text);
                expect(result).toBe(0);
            });

            it("Should return a valid index from text position (line/character)", () => {
                const text = "Line 1\n...line 2\n and the last one!";

                let result = textTool.getIndexFromPosition(text, {
                    line: 0,
                    ch: 3
                });

                expect(result).toBe(3);

                result = textTool.getIndexFromPosition(text, {
                    line: 1,
                    ch: 2
                });

                expect(result).toBe(7);
            });

            it("Should return a single quote", () => {
                spyOn(prefs, "get").andCallFake((option) => {
                    if (option === constants.prefs.USE_SINGLE_QUOTES) {
                        return true;
                    }
                });

                expect(textTool.getQuote()).toBe("'");
            });

            it("Should return a double quote", () => {
                spyOn(prefs, "get").andCallFake((option) => {
                    if (option === constants.prefs.USE_SINGLE_QUOTES) {
                        return false;
                    }
                });

                expect(textTool.getQuote()).toBe("\"");
            });
        });
    };
});
