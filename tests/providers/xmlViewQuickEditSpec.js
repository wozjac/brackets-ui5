define((require, exports) => {
    "use strict";

    const xmlViewQuickEditProvider = require("src/quickEdit/xmlViewQuickEditProvider"),
        testUtils = require("tests/testUtils");

    exports.getTests = function () {
        describe("[wozjac.ui5] xmlViewQuickEditProvider.js tests", () => {
            it("Should return function name from attribute #1", () => {
                const xml = "<SearchField search=\"onSearchField \"/>";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 22
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("onSearchField");
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should return function name from attribute #2", () => {
                const xml = "<SearchField search=\".onSearchField \"/>";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 23
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("onSearchField");
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should return function name from attribute #3", () => {
                const xml = "<Button text=\"-10\" press=\".handleChange(-10)\" />";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 29
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("handleChange");
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should return function name from attribute #4", () => {
                const xml = "<Button text=\"-10\" press=\".displayValue(${amount})\" />";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 29
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("displayValue");
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should return function name from attribute #5", () => {
                const xml = "<Button text=\"-10\" press=\".handleNewValue(${$parameters>/newValue})\" />";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 29
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("handleNewValue");
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should return function name from attribute #6", () => {
                const xml = "<Button text=\"-10\" press=\".showText(${$source>/text})\" />";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 29
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("showText");
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should return function name from attribute #7", () => {
                const xml = "<Button text=\"-10\" press=\".showText($controller.byId('someInput').getValue())\" />";
                const testEditor = testUtils.createTestEditor(xml, "xml");

                const position = {
                    line: 0,
                    ch: 29
                };

                const functionName = xmlViewQuickEditProvider._getFunctionName(testEditor.editor, position);
                expect(functionName).toBe("showText");
                testUtils.destroyTestEditor(testEditor);
            });
        });
    };
});
