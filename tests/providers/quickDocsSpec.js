define((require, exports) => {
    "use strict";

    const ui5QuickDocsProvider = require("src/quickDocs/ui5QuickDocsProvider"),
        testUtils = require("tests/testUtils"),
        jsContent = require("text!tests/fixtures/testCode.js");

    exports.getTests = function () {
        let testEditor;

        function expectQuickDocsWidgetForEventProvider(position) {
            const providerPromise = ui5QuickDocsProvider.getInlineProvider(testEditor.editor, position);
            expect(providerPromise).not.toBeNull();

            let widget = null;

            providerPromise.then((inlineWidget) => {
                widget = inlineWidget;
            });

            waitsFor(() => {
                return widget !== null;
            });

            runs(() => {
                expect(widget).toBeTruthy();
                expect(widget.$htmlContent.find(".css-prop-summary").find("h1").text()).toBe("sap.ui.base.EventProvider");

                const memberHeaders = widget.$htmlContent.find("h4");
                expect(memberHeaders.length).toBe(4);
                expect(memberHeaders.eq(0).text()).toBe("Methods:");
                expect(memberHeaders.eq(1).text()).toBe("Constructor:");

                const members = widget.$htmlContent.find(".brackets-ui5-qdocs-object-members");
                expect(members.length).toBe(2);
                expect(members.eq(0).find("li").length).toBe(7); //methods
                expect(members.eq(1).find("li").length).toBe(5); //inherited methods
            });
        }

        describe("[wozjac.ui5] inline quick docs tests", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();
                testEditor = testUtils.createTestEditor(jsContent, "js");
            });

            afterEach(() => {
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should not return quick docs for a partial token", () => {
                const position = {
                    line: 14,
                    ch: 19
                };

                testEditor.editor.setCursorPos(position);

                const provider = ui5QuickDocsProvider.getInlineProvider(testEditor.editor, position);
                expect(provider).toBeNull();
            });

            it("Should not return quick docs for a language identifier", () => {
                const position = {
                    line: 11,
                    ch: 15
                };

                testEditor.editor.setCursorPos(position);

                const provider = ui5QuickDocsProvider.getInlineProvider(testEditor.editor, position);
                expect(provider).toBeNull();
            });

            it("Should return quick docs for an UI5 object variable in the define statement", () => {
                const position = {
                    line: 4,
                    ch: 32
                };

                testEditor.editor.setCursorPos(position);
                expectQuickDocsWidgetForEventProvider(position);
            });

            it("Should return quick docs for an ui5 object variable in the construction statement", () => {
                const position = {
                    line: 10,
                    ch: 31
                };

                testEditor.editor.setCursorPos(position);
                expectQuickDocsWidgetForEventProvider(position);
            });

            it("Should return quick docs for a variable in the construction statement", () => {
                const position = {
                    line: 10,
                    ch: 20
                };

                testEditor.editor.setCursorPos(position);
                expectQuickDocsWidgetForEventProvider(position);
            });

            it("Should return quick docs for a variable #1", () => {
                const position = {
                    line: 12,
                    ch: 16
                };

                testEditor.editor.setCursorPos(position);
                expectQuickDocsWidgetForEventProvider(position);
            });

            it("Should return quick docs for a variable #2", () => {
                const position = {
                    line: 13,
                    ch: 13
                };

                testEditor.editor.setCursorPos(position);
                expectQuickDocsWidgetForEventProvider(position);
            });

            it("Should return quick docs for a variable #3", () => {
                const position = {
                    line: 14,
                    ch: 16
                };

                testEditor.editor.setCursorPos(position);
                expectQuickDocsWidgetForEventProvider(position);
            });
        });
    };
});
