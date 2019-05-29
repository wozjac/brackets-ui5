define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService"),
        ui5HintsProvider = require("src/codeHints/ui5HintsProvider"),
        testUtils = require("tests/testUtils"),
        jsContent = require("text!tests/fixtures/testCode.js");

    const EVENT_PROVIDER_HINTS_LENGTH = 11,
        EVENT_PROVIDER_NAME = "EventProvider",
        SAP_OBJECT_NAME = "Object",
        SAP_OBJECT_HINTS_LENGTH = 5;

    exports.getTests = function () {
        let testEditor,
            ui5ObjectsLoaded,
            ui5LibrariesLoaded;

        testEditor = testUtils.createTestEditor(jsContent, "js");

        function waitForHints(hintObj, callback) {
            let complete = false,
                hintList = null;

            if (hintObj.hasOwnProperty("hints")) {
                complete = true;
                hintList = hintObj.hints;
            } else {
                hintObj.done((obj) => {
                    complete = true;
                    hintList = obj.hints;
                });
            }

            waitsFor(() => {
                return complete;
            }, "Expected hints did not resolve", 3000);

            runs(() => {
                callback(hintList);
            });
        }

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

        function expectHints(provider, sapui5Object, hintsLength, callback) {
            waitForHints(provider.getHints(), (hintList) => {
                expect(provider.proposedUi5Object.basename).toBe(sapui5Object);
                expect(hintList.length).toBe(hintsLength);

                if (callback) {
                    callback(hintList);
                }
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
                expectHints(provider, EVENT_PROVIDER_NAME, EVENT_PROVIDER_HINTS_LENGTH);
            });

            it("Should have filtered hints after a partial member string", () => {
                testEditor.editor.setCursorPos({
                    line: 14,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                waitForHints(provider.getHints(), (hintList) => {
                    expect(hintList.length).toBe(1);
                    expectHintsEntries(hintList, ["destroy"]);
                });
            });

            it("Should hint for a variable created as a member", () => {
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

                    expectHints(provider, EVENT_PROVIDER_NAME, EVENT_PROVIDER_HINTS_LENGTH, () => {
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return Object hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, SAP_OBJECT_NAME, SAP_OBJECT_HINTS_LENGTH, () => {
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });

                });

                it("Should return EventProvider hints again", () => {
                    testEditor.editor.setCursorPos({
                        line: 13,
                        ch: 17
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, EVENT_PROVIDER_NAME, EVENT_PROVIDER_HINTS_LENGTH, () => {
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return Object hints again", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, SAP_OBJECT_NAME, SAP_OBJECT_HINTS_LENGTH, () => {
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });

                });

                it("Should return Object hints from cache", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, SAP_OBJECT_NAME, SAP_OBJECT_HINTS_LENGTH, () => {
                        expect(provider._resolveWithCachedApiObject).toHaveBeenCalled();
                    });
                });

                it("Should use Object from cache, but not the cached hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 16,
                        ch: 18
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, SAP_OBJECT_NAME, 2, () => {
                        expect(provider._resolveWithCachedApiObject).toHaveBeenCalled();
                    });
                });

                it("Should return ex- prefixed method hints from EventProvider", () => {
                    testEditor.editor.setCursorPos({
                        line: 14,
                        ch: 19
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, EVENT_PROVIDER_NAME, 1, (hintList) => {
                        expect(hintList.length).toBe(1);
                        expectHintsEntries(hintList, ["destroy"]);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return valid hints after changing the contructor from EventProvider to Object", () => {
                    testEditor.doc.replaceRange("SapObject();", {
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

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, SAP_OBJECT_NAME, SAP_OBJECT_HINTS_LENGTH, () => {
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
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

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                    expectHints(provider, EVENT_PROVIDER_NAME, EVENT_PROVIDER_HINTS_LENGTH, () => {
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });
            });

            it("Should insert the hint after a dot", () => {
                testEditor.editor.setCursorPos({
                    line: 13,
                    ch: 17
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                expectHints(provider, EVENT_PROVIDER_NAME, EVENT_PROVIDER_HINTS_LENGTH, (hintList) => {
                    const selectedHint = selectHint("destroy", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(13).trim()).toBe("tree.destroy()");
                });
            });

            it("Should insert the hint after a partial name of a method", () => {
                testEditor.editor.setCursorPos({
                    line: 14,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                expectHints(provider, EVENT_PROVIDER_NAME, 1, (hintList) => {
                    const selectedHint = selectHint("destroy", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(14).trim()).toBe("tree.destroy()");
                });
            });

            it("Should insert the hint after a dot without parameters", () => {
                testEditor.editor.setCursorPos({
                    line: 17,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                expectHints(provider, EVENT_PROVIDER_NAME, 1, (hintList) => {
                    const selectedHint = selectHint("destroy", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(17).trim()).toBe("tree.destroy(param1)");
                });
            });

            it("Should return no hints for item in the second function", () => {
                testEditor.editor.setCursorPos({
                    line: 25,
                    ch: 17
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should return correct item with the same name in another function", () => {
                testEditor.editor.setCursorPos({
                    line: 45,
                    ch: 18
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                expectHints(provider, SAP_OBJECT_NAME, SAP_OBJECT_HINTS_LENGTH);
            });
        });
    };
});
