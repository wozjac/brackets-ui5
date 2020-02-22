define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService"),
        ui5HintsProvider = require("src/codeHints/ui5HintsProvider"),
        testUtils = require("tests/testUtils"),
        hintsExpect = require("tests/jsHintsExpect"),
        jsContent = require("text!tests/fixtures/testCodeHintsDefine.js");

    const SAP_LIBRARY_OBJECTS_HINTS_LENGTH = 6;

    exports.getTests = function () {
        let testEditor,
            ui5ObjectsLoaded,
            ui5LibrariesLoaded;

        testEditor = testUtils.createTestEditor(jsContent, "js");

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
                ui5ObjectsLoaded = false;
                ui5LibrariesLoaded = false;
            });

            it("Should hint in the define function with no partial token before #1", () => {
                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 26
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    expect(hintList.length).toBe(SAP_LIBRARY_OBJECTS_HINTS_LENGTH);
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                });
            });

            it("Should hint in the define function with no partial token before #2", () => {
                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 27
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    expect(hintList.length).toBe(SAP_LIBRARY_OBJECTS_HINTS_LENGTH);
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                });
            });

            it("Should not hint in the define function with no partial token before #3", () => {
                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 4
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should have no hints for incorrect UI5 object token before cursor", () => {
                testEditor.editor.setCursorPos({
                    line: 4,
                    ch: 9
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                hintsExpect.expectNoHints(provider.getHints());
            });

            it("Should hint for sap* objects", () => {
                testEditor.editor.setCursorPos({
                    line: 5,
                    ch: 8
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);
                });
            });

            it("Should hint for sap.u* objects", () => {
                testEditor.editor.setCursorPos({
                    line: 6,
                    ch: 10
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap.u") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);
                });
            });

            it("Should hint for sap.* objects", () => {
                testEditor.editor.setCursorPos({
                    line: 7,
                    ch: 9
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);
                });
            });

            it("Should hint for sap/* objects", () => {
                testEditor.editor.setCursorPos({
                    line: 8,
                    ch: 9
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);
                });
            });

            it("Should hint for sap.ui* objects", () => {
                testEditor.editor.setCursorPos({
                    line: 9,
                    ch: 11
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap.ui") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);
                });
            });

            it("Should insert the hint in the empty define (multiline)", () => {
                testEditor.doc.setText(`sap.ui.define([""
                    ], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 16
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Tree\"");
                    expect(testEditor.doc.getLine(1).trim()).toBe("], function (Tree) {");
                });
            });

            it("Should insert the hint in the empty define (multiline, no quotes)", () => {
                testEditor.doc.setText(`sap.ui.define([
                    ], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 15
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should not hint in the empty define (multiline, no quotes, second line)", () => {
                testEditor.doc.setText(`sap.ui.define([
                    ], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the empty define (multiline, second line)", () => {
                testEditor.doc.setText(`sap.ui.define([
                    ""   ], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 21
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([");
                    expect(testEditor.doc.getLine(1).trim()).toBe("\"sap/m/Tree\"   ], function (Tree) {");
                });
            });

            it("Should insert the hint in the empty define array only (multiline, no function)", () => {
                testEditor.doc.setText(`sap.ui.define([""
                    ], {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 16
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Tree\"");
                    expect(testEditor.doc.getLine(1).trim()).toBe("], {");
                });
            });

            it("Should insert the hint in the empty define (one line)", () => {
                testEditor.doc.setText(`sap.ui.define([""], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 16
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Tree\"], function (Tree) {");
                });
            });

            it("Should insert the hint in the empty define (one line, no quotes)", () => {
                testEditor.doc.setText(`sap.ui.define([ ], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 15
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define after one token", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button", ""], function (Button) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 32
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Button\", \"sap/m/Tree\"], function (Button, Tree) {");
                });
            });

            it("Should insert the hint in the existing define after one token, no quotes", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button", ], function (Button) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 31
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define after one token, quotes, multiline", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button", ""
                    ], function (
                        Button
                    ) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 32
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Button\", \"sap/m/Tree\"");
                    expect(testEditor.doc.getLine(2).trim()).toBe("Button, Tree");
                });
            });

            it("Should insert the hint in the existing define after one token, no quotes, multiline", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button",
                    ], function (
                        Button
                    ) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 32
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define between two tokens, quotes, one line", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button", "" "sap/m/Label"], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 32
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Button\", \"sap/m/Tree\" \"sap/m/Label\"], function (Button, Tree, Label) {");
                });
            });

            it("Should insert the hint in the existing define between two tokens, no quotes, one line", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button",  "sap/m/Label"], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 31
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define between two tokens, quotes, multi line array", () => {
                testEditor.doc.setText(`sap.ui.define([
                    "sap/m/Button",
                    ""
                    "sap/m/Label"], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 2,
                    ch: 21
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(2).trim()).toBe("\"sap/m/Tree\"");
                    expect(testEditor.doc.getLine(3).trim()).toBe("\"sap/m/Label\"], function (Button, Tree, Label) {");
                });
            });

            it("Should insert the hint in the existing define between two tokens, quotes, multi line both", () => {
                testEditor.doc.setText(`sap.ui.define([
                    "sap/m/Button",
                    ""
                    "sap/m/Label"], function (
                        Button,
                        Label
                    ) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 2,
                    ch: 21
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(2).trim()).toBe("\"sap/m/Tree\"");
                    expect(testEditor.doc.getLine(4).trim()).toBe("Button, Tree,");
                });
            });

            it("Should insert the hint in the existing define between two tokens, no quotes, multi line array", () => {
                testEditor.doc.setText(`sap.ui.define([
                    "sap/m/Button",

                    "sap/m/Label"], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 2,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define between two tokens, no quotes, multi line both", () => {
                testEditor.doc.setText(`sap.ui.define([
                    "sap/m/Button",

                    "sap/m/Label"], function (
                        Button,
                        Label
                    ) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 2,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define after two tokens, quotes, one line", () => {
                testEditor.doc.setText(`sap.ui.define(["sap/m/Button", "sap/m/Label" ""], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 46
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Button\", \"sap/m/Label\" \"sap/m/Tree\"], function (Button, Label, Tree) {");
                });
            });

            it("Should insert the hint in the existing define before two tokens, no quotes, one line", () => {
                testEditor.doc.setText(`sap.ui.define([ "sap/m/Button", "sap/m/Label"], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 15
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define before two tokens, quotes, one line", () => {
                testEditor.doc.setText(`sap.ui.define(["", "sap/m/Button", "sap/m/Label"], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 16
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define([\"sap/m/Tree\", \"sap/m/Button\", \"sap/m/Label\"], function (Tree, Button, Label) {");
                });
            });

            it("Should insert the hint in the existing define before two tokens, quotes, multi line", () => {
                testEditor.doc.setText(`sap.ui.define([
                    "",
                    "sap/m/Button",
                    "sap/m/Label"], function (
                        Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 21
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    hintsExpect.expectAllLibraryObjectsHintsEntries(hintList);
                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(1).trim()).toBe("\"sap/m/Tree\",");
                    expect(testEditor.doc.getLine(4).trim()).toBe("Tree, Button, Label) {");
                });
            });

            it("Should insert the hint in the existing define before two tokens, no quotes, multi line", () => {
                testEditor.doc.setText(`sap.ui.define([
                    ,
                    "sap/m/Button",
                    "sap/m/Label"], function (
                        Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 20
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(false);
            });

            it("Should insert the hint in the existing define between tokens, partially provided token, qoutes", () => {
                testEditor.doc.setText(`sap.ui.define([
	               "sap/m/Button",
                    "sap/m/Tr",
                    "sap/m/Label"
                    ], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 2,
                    ch: 29
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap.m.Tr") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);

                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(2).trim()).toBe("\"sap/m/Tree\",");
                    expect(testEditor.doc.getLine(4).trim()).toBe("], function (Button, Tree, Label) {");
                });
            });

            it("Should not hint in the existing define between tokens, partially provided token, no qoutes", () => {
                testEditor.doc.setText(`sap.ui.define([
	               "sap/m/Button",
                    sap/m/Tr
                    "sap/m/Label"
                    ], function (Button, Label) {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 2,
                    ch: 28
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                hintsExpect.expectNoHints(provider.getHints());
            });

            it("Should not hint in the empty define, partially provided token, one line, no quotes", () => {
                testEditor.doc.setText(`sap.ui.define([sap.m.T], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 22
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);
                hintsExpect.expectNoHints(provider.getHints());
            });

            it("Should hint in the empty define, partially provided token, one line, quotes", () => {
                testEditor.doc.setText(`sap.ui.define(['sap.m.T'], function () {
                    "use strict";`);

                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 23
                });

                const provider = ui5HintsProvider.getUi5CodeHintsProvider();
                expect(provider.hasHints(testEditor.editor, null)).toBe(true);

                hintsExpect.waitForHints(provider.getHints(), (hintList) => {
                    const expectedNames = hintsExpect.SAP_LIBRARY_API_OBJECT_NAMES.filter((element) => {
                        return element.indexOf("sap.m.Tr") !== -1;
                    });

                    hintsExpect.expectHintsEntries(hintList, expectedNames);

                    const selectedHint = hintsExpect.selectHint("sap.m.Tree", hintList);
                    provider.insertHint(selectedHint);
                    expect(testEditor.doc.getLine(0).trim()).toBe("sap.ui.define(['sap/m/Tree'], function (Tree) {");
                });
            });
        });
    };
});
