define((require, exports) => {
    "use strict";

    const docsPanel = require("src/docsPanel/docsPanel"),
        testUtils = require("tests/testUtils");

    exports.getTests = function () {
        describe("[wozjac.ui5] API reference panel tests", () => {
            let testEditor;

            beforeEach(() => {
                testUtils.mockUi5Api();
                testEditor = testUtils.createTestEditor("", "js");
            });

            afterEach(() => {
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should create a docs panel object", () => {
                docsPanel.create();
                const panel = docsPanel.get();
                expect(panel).not.toBeFalsy();
                expect(panel._visible).toBe(false);
                docsPanel.create();
                const panel2 = docsPanel.get();
                expect(panel).toBe(panel2);
            });
        });
    };
});
