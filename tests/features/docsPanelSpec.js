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
                docsPanel.destroy();
                docsPanel.create();
            });

            afterEach(() => {
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should create one docs panel object", () => {
                const panel = docsPanel.get();
                expect(panel).not.toBeFalsy();
                expect(panel._visible).toBe(false);
                docsPanel.create();
                const panel2 = docsPanel.get();
                expect(panel).toBe(panel2);
            });

            it("Should open the panel in initial state", () => {
                const panel = docsPanel.get();
                expect(panel).not.toBeFalsy();
                const panelDiv = $("#brackets-ui5-docs-panel");
                expect(panelDiv).not.toBeFalsy();
            });
        });
    };
});
