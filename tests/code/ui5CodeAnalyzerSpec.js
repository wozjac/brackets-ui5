define((require, exports) => {
    "use strict";

    const CodeAnalyzer = require("src/code/Ui5CodeAnalyzer"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        textTool = require("src/editor/textTool"),
        testUtils = require("tests/testUtils"),
        editorUtils = require("tests/editorUtils");

    exports.getTests = function () {
        const ui5CoreLabelObject = {
            apiDocUrl: "https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.core.Label.html",
            library: "sap.ui.core",
            kind: "class",
            basename: "Label",
            name: "sap.ui.core.Label"
        };

        const ui5LabelObject = {
            apiDocUrl: "https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.Label.html",
            kind: "class",
            library: "sap.m",
            basename: "Label",
            name: "sap.m.Label"
        };

        describe("[wozjac.ui5] codeAnalyzer.js", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();

                spyOn(ui5ApiFinder, "findUi5ObjectByName").andCallFake((path) => {
                    switch (path) {
                        case "sap.ui.core.Label":
                            return ui5CoreLabelObject;
                        case "sap.m.Tree":
                            return ui5LabelObject;
                    }
                });
            });

            it("Should return ui5 path from the comment #1", () => {
                const code = "function() {\n"
                    + "let i = new Label();\n"
                    + "let lab = getLabel();  //ui5: sap.ui.core.Label\n"
                    + "lab\n"
                    + "}";

                const token = "lab",
                    position = {
                        line: 3,
                        ch: 0
                    };

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());
                expect(codeAnalyzer.resolveUi5Token(token, position)[0]).toBe(ui5CoreLabelObject);
                editorUtils.destroyMockEditor(mockEditor.doc);
            });

            it("Should return ui5 path from the comment #2", () => {
                const code = `function() {
                let i = new Label();
                let lab = new sap.m.Label();  //ui5: sap.ui.core.Label
                lab
                }`;

                const token = "lab",
                    position = {
                        line: 3,
                        ch: 0
                    };

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());
                expect(codeAnalyzer.resolveUi5Token(token, position)[0]).toBe(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the comment #3", () => {
                const code = `function() {
                    let lab = new sap.m.Label();
                }

                function() {
                    let i = new Label();
                    let lab = new Label();  //ui5: sap.ui.core.Label
                    lab
                }
                }`;

                const token = "lab",
                    position = {
                        line: 7,
                        ch: 0
                    };

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());
                expect(codeAnalyzer.resolveUi5Token(token, position)[0]).toBe(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the comment #4", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new Label();
                }

                function() {
                    let i = new Label();
                    var lab = new Label();  //ui5: sap.ui.core.Label
                    lab
                }
                )}`;

                const token = "lab",
                    position = {
                        line: 7,
                        ch: 0
                    };

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());
                expect(codeAnalyzer.resolveUi5Token(token, position)[0]).toBe(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the comment #5", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    const lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab
                }

                function() {
                    let i = new Label();
                    let label = new Label();
                    label
                }
                )}`;

                const token = "lab",
                    position = {
                        line: 2,
                        ch: 0
                    };

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());
                expect(codeAnalyzer.resolveUi5Token(token, position)[0]).toBe(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object constructor #1", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab
                }

                function() {
                        let i = new Label();
                        let labk = new sap.ui.core.Label();
                        lab
                    }
                )}`;

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 8,
                    ch: 0
                })[0]).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object constructor #2", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    var lab = new sap.m.Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const labk = new Label();
                    lab
                }
                )}`;

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 8,
                    ch: 0
                })[0]).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object constructor #3", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    const lab = new Label();
                    lab
                }

                function() {
                    let i = new Label();
                    let labk = new sap.m.Label();
                    lab
                }
                )}`;

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const codeAnalyzer = new CodeAnalyzer(mockEditor.doc.getText());

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 2,
                    ch: 0
                })[0]).toEqual(ui5CoreLabelObject);
            });

            it("Should resolve the ui5 token #1", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const lab = new Label(); //ui5: sap.ui.core.Label
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 11,
                    ch: 0
                }, code)).toEqual([ui5CoreLabelObject]);
            });

            it("Should resolve the ui5 token #2", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const lab = new sap.m.Label(); /* ui5:sap.ui.core.Label */
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 11,
                    ch: 0
                }, code)).toEqual([ui5CoreLabelObject]);
            });

            it("Should resolve the ui5 token #3", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const lab = new sap.m.Label(); /* ui: sap.ui.core.Label */
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 11,
                    ch: 0
                }, code)).toEqual([ui5LabelObject]);
            });

            it("Should resolve the ui5 token #4", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const lab = new Label(); /* comment */
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 11,
                    ch: 0
                }, code)).toEqual([ui5LabelObject]);
            });

            it("Should resolve the ui5 token #5", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                    Label
                }

                function() {
                    let i = new Label();
                    const lab = new Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("Label", {
                    line: 5,
                    ch: 0
                }, code)).toEqual([ui5LabelObject]);
            });

            it("Should resolve the ui5 token #6", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                }

                function() {
                    let i = new Label();
                    const lab = new sap.ui.core.Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 10,
                    ch: 0
                }, code)).toEqual([ui5CoreLabelObject]);
            });

            it("Should resolve the ui5 token #6", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                }

                function() {
                    let i = new Label();
                    const lab = new sap.ui.core.Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("Label", {
                    line: 3,
                    ch: 0
                }, code)).toEqual([ui5LabelObject]);
            });

            it("Should resolve the ui5 token #6", () => {
                const code = `sap.ui.define
                (
                [
                'sap/m/Label',
                'sap/m/Button'
                ],
                function
                    (
                        Label,
                Button) {
                    var lab = new Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const lab = new sap.ui.core.Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.resolveUi5Token("lab", {
                    line: 11,
                    ch: 0
                }, code)).toEqual([ui5LabelObject]);
            });
        });
    };
});
