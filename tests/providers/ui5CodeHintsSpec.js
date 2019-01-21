define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService"),
        ui5HintsProvider = require("src/codeHints/ui5HintsProvider"),
        testUtils = require("tests/testUtils"),
        jsContent = require("text!tests/fixtures/testCode.js");

    exports.getTests = function () {
        let testEditor,
            ui5ObjectsLoaded,
            ui5LibrariesLoaded;

        function expectHintsEntries(hintList, expectedEntries) {
            const hints = hintList.map((element) => {
                return element.find("span.brackets-ui5-hint-name").text();
            });

            expect(hints).toEqual(expectedEntries);
        }

        function selectHint(hintText, hintList) {
            return hintList.find((hintObject) => {
                return hintObject.find("span.brackets-ui5-hint-name").text() === hintText;
            });
        }

        describe("[wozjac.ui5] ui5 JS code hints", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();
                testEditor = testUtils.createTestEditor(jsContent, "js");

                ui5ApiService.loadUi5Objects().then(() => {
                    ui5ObjectsLoaded = true;
                    ui5ApiService.loadUi5LibrariesDesignApi().then(() => {
                        ui5LibrariesLoaded = true;
                    });
                });

                waitsFor(() => {
                    return ui5ObjectsLoaded === true && ui5LibrariesLoaded === true;
                }, "should load ui5 objects", 500);
            });

            afterEach(() => {
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should have all possible hints after .", () => {
                testEditor.editor.setCursorPos({
                    line: 13,
                    ch: 17
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                const hintsObject = provider.getHints();
                expect(hintsObject).toBeTruthy();
                expect(hintsObject.hints.length).toBe(11);
            });

            it("Should have filtered hints after a partial member string", () => {
                testEditor.editor.setCursorPos({
                    line: 14,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                const hintsObject = provider.getHints();
                expect(hintsObject).toBeTruthy();
                expect(hintsObject.hints.length).toBe(1);
                expectHintsEntries(hintsObject.hints, ["destroy"]);
            });

            it("Should hint for created as a member", () => {
                testEditor.editor.setCursorPos({
                    line: 20,
                    ch: 26
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                const hintsObject = provider.getHints();
                expect(hintsObject).toBeTruthy();
                expect(hintsObject.hints.length).toBe(1);
                expectHintsEntries(hintsObject.hints, ["destroy"]);
            });

            describe("Should have valid hints for objects in a serie", () => {
                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                let hintsObject = null;

                beforeEach(() => {
                    spyOn(provider, "_resolveWithCachedHints").andCallThrough();
                    spyOn(provider, "_resolveWithCachedApiObject").andCallThrough();
                    spyOn(provider, "_resolveWithApiObjectSearch").andCallThrough();
                });

                it("Should return EventProvider hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 13,
                        ch: 17
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(11);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });

                it("Should return Object hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(5);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });

                it("Should return EventProvider hints again", () => {
                    testEditor.editor.setCursorPos({
                        line: 13,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(11);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });

                it("Should return Object hints again", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(5);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });

                it("Should return Object hints from cache", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(true);
                    expect(provider.useCachedUi5ObjectApi).toBe(true);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(5);
                    expect(provider._resolveWithCachedApiObject).toHaveBeenCalled();

                });

                it("Should use Object from cache, but not the cached hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 16,
                        ch: 18
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(true);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(2);
                    expect(provider._resolveWithCachedApiObject).toHaveBeenCalled();
                });

                it("Should return ex- prefixed method hints from EventProvider", () => {
                    testEditor.editor.setCursorPos({
                        line: 14,
                        ch: 19
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(1);
                    expectHintsEntries(hintsObject.hints, ["destroy"]);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });

                it("Should return valid hints after changing the contructor from EventProvider to Object", () => {
                    testEditor.doc.replaceRange("Object();", {
                        line: 10,
                        ch: 29
                    }, {
                        line: 10,
                        ch: 47
                    });

                    testEditor.editor.setCursorPos({
                        line: 13,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(5);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });

                it("Should return valid hints after changing the define object from Object to EventProvider", () => {
                    testEditor.doc.replaceRange("\"sap/ui/base/EventProvider\"", {
                        line: 3,
                        ch: 4
                    }, {
                        line: 3,
                        ch: 47
                    });

                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    hintsObject = provider.getHints();
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(11);
                    expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                });
            });

            it("Should insert the hint after a dot", () => {
                testEditor.editor.setCursorPos({
                    line: 13,
                    ch: 17
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                const hintsObject = provider.getHints();
                expect(hintsObject).toBeTruthy();
                expect(hintsObject.hints.length).toBe(11);
                const selectedHint = selectHint("destroy", hintsObject.hints);
                provider.insertHint(selectedHint);
                expect(testEditor.doc.getLine(13).trim()).toBe("tree.destroy()");
            });

            it("Should insert the hint after a partial name of a method", () => {
                testEditor.editor.setCursorPos({
                    line: 14,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                const hintsObject = provider.getHints();
                expect(hintsObject).toBeTruthy();
                expect(hintsObject.hints.length).toBe(1);
                const selectedHint = selectHint("destroy", hintsObject.hints);
                provider.insertHint(selectedHint);
                expect(testEditor.doc.getLine(14).trim()).toBe("tree.destroy()");
            });

            it("Should insert the hint after a dot without parameters", () => {
                testEditor.editor.setCursorPos({
                    line: 17,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                const hintsObject = provider.getHints();
                expect(hintsObject).toBeTruthy();
                expect(hintsObject.hints.length).toBe(1);
                const selectedHint = selectHint("destroy", hintsObject.hints);
                provider.insertHint(selectedHint);
                expect(testEditor.doc.getLine(17).trim()).toBe("tree.destroy(param1)");
            });

            it("Should return no hints for item in the second function", () => {
                testEditor.editor.setCursorPos({
                    line: 25,
                    ch: 17
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });
        });
    };
});
