define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService"),
        ui5HintsProvider = require("src/codeHints/ui5HintsProvider"),
        testUtils = require("tests/testUtils"),
        jsContent = require("text!tests/fixtures/testCode.js");

    exports.getTests = function () {
        let testEditor,
            ui5ObjectsLoaded,
            ui5ApiIndexLoaded;

        function expectHintsEntries(hintList, expectedEntries) {
            const hints = hintList.map((element) => {
                return element.contents().not(element.children()).text();
            });

            expect(hints).toEqual(expectedEntries);
        }

        function selectHint(hintText, hintList) {
            return hintList.find((hintObject) => {
                return hintObject.contents().not(hintObject.children()).text() === hintText;
            });
        }

        describe("[wozjac.ui5] ui5 JS code hints", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();
                testEditor = testUtils.createTestEditor(jsContent, "js");

                ui5ApiService.loadUi5Objects().then(() => {
                    ui5ObjectsLoaded = true;
                });

                ui5ApiService.loadUi5ApiIndex().then(() => {
                    ui5ApiIndexLoaded = true;
                });

                waitsFor(() => {
                    return ui5ObjectsLoaded === true && ui5ApiIndexLoaded === true;
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

                let hintsObject = null;

                provider.getHints().then((hintsObj) => {
                    hintsObject = hintsObj;
                });

                waitsFor(() => {
                    return hintsObject !== null;
                });

                runs(() => {
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(11);
                });
            });

            it("Should have filtered hints after a partial member string", () => {
                testEditor.editor.setCursorPos({
                    line: 14,
                    ch: 19
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                let hintsObject = null;

                provider.getHints().then((hintsObj) => {
                    hintsObject = hintsObj;
                });

                waitsFor(() => {
                    return hintsObject !== null;
                });

                runs(() => {
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(2);
                    expectHintsEntries(hintsObject.hints, ["expandToLevel", "extend"]);
                });
            });

            it("Should hint for created as a member", () => {
                testEditor.editor.setCursorPos({
                    line: 20,
                    ch: 25
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                let hintsObject = null;

                provider.getHints().then((hintsObj) => {
                    hintsObject = hintsObj;
                });

                waitsFor(() => {
                    return hintsObject !== null;
                });

                runs(() => {
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(2);
                    expectHintsEntries(hintsObject.hints, ["expandToLevel", "extend"]);
                });
            });

            describe("Should have valid hints for objects in a serie", () => {
                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                let hintsObject = null;

                beforeEach(() => {
                    spyOn(provider, "_resolveWithCachedHints").andCallThrough();
                    spyOn(provider, "_resolveWithCachedApiObject").andCallThrough();
                    spyOn(provider, "_resolveWithApiObjectSearch").andCallThrough();
                });

                it("Should return sap.m.Tree hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 13,
                        ch: 17
                    });

                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(11);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return sap.m.ColumnListItem hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(14);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return sap.m.Tree hints again", () => {
                    testEditor.editor.setCursorPos({
                        line: 13,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(11);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return sap.m.ColumnListItem hints again", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(14);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return sap.m.ColumnListItem hints from cache", () => {
                    testEditor.editor.setCursorPos({
                        line: 15,
                        ch: 17
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(true);
                    expect(provider.useCachedUi5ObjectApi).toBe(true);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(14);
                        expect(provider._resolveWithCachedHints).toHaveBeenCalled();
                    });
                });

                it("Should use sap.m.ColumnListItem from cache, but not the cached hints", () => {
                    testEditor.editor.setCursorPos({
                        line: 16,
                        ch: 18
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(true);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(3);
                        expect(provider._resolveWithCachedApiObject).toHaveBeenCalled();
                    });
                });

                it("Should return ex- prefixed method hints from sap.m.Tree", () => {
                    testEditor.editor.setCursorPos({
                        line: 14,
                        ch: 19
                    });

                    hintsObject = null;
                    expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                    expect(provider.useCachedHints).toBe(false);
                    expect(provider.useCachedUi5ObjectApi).toBe(false);

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(2);
                        expectHintsEntries(hintsObject.hints, ["expandToLevel", "extend"]);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return valid hints after changing the contructor from sap.m.Tree to sap.m.ColumnListItem", () => {
                    testEditor.doc.replaceRange("ColumnListItem();", {
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

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(14);
                        expect(provider._resolveWithApiObjectSearch).toHaveBeenCalled();
                    });
                });

                it("Should return valid hints after changing the define object from sap.m.ColumnListItem to sap.m.Tree", () => {
                    testEditor.doc.replaceRange("\"sap/m/Tree\"", {
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

                    provider.getHints().then((hintsObj) => {
                        hintsObject = hintsObj;
                    });

                    waitsFor(() => {
                        return hintsObject !== null;
                    });

                    runs(() => {
                        expect(hintsObject).toBeTruthy();
                        expect(hintsObject.hints.length).toBe(11);
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

                let hintsObject = null;

                provider.getHints().then((hintsObj) => {
                    hintsObject = hintsObj;
                });

                waitsFor(() => {
                    return hintsObject !== null;
                });

                runs(() => {
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(11);
                    const selectedHint = selectHint("extend", hintsObject.hints);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(13).trim()).toBe("tree.extend(sClassName,oClassInfo,FNMetaImpl)");
                });
            });

            it("Should insert the hint after a partial name of a method", () => {
                testEditor.editor.setCursorPos({
                    line: 14,
                    ch: 19
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                let hintsObject = null;

                provider.getHints().then((hintsObj) => {
                    hintsObject = hintsObj;
                });

                waitsFor(() => {
                    return hintsObject !== null;
                });

                runs(() => {
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(2);
                    const selectedHint = selectHint("extend", hintsObject.hints);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(14).trim()).toBe("tree.extend(sClassName,oClassInfo,FNMetaImpl)");
                });
            });

            it("Should insert the hint after a dot without parameters", () => {
                testEditor.editor.setCursorPos({
                    line: 17,
                    ch: 19
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                let hintsObject = null;

                provider.getHints().then((hintsObj) => {
                    hintsObject = hintsObj;
                });

                waitsFor(() => {
                    return hintsObject !== null;
                });

                runs(() => {
                    expect(hintsObject).toBeTruthy();
                    expect(hintsObject.hints.length).toBe(2);
                    const selectedHint = selectHint("extend", hintsObject.hints);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(17).trim()).toBe("tree.extend(param1)");
                });
            });
        });
    };
});
