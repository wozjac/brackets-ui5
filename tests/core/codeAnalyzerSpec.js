define((require, exports) => {
    "use strict";

    const DocumentManager = brackets.getModule("document/DocumentManager"),
        codeAnalyzer = require("src/editor/codeAnalyzer"),
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

            it("Should not extract falsy array", () => {
                expect(codeAnalyzer.extractDefineObjects(undefined)).toBe(null);
                expect(codeAnalyzer.extractDefineObjects("")).toBe(null);
            });

            it("Should extract define statement array", () => {
                const result = codeAnalyzer.extractDefineObjects("test1/Object1, test2/Object2");
                expect(result).toEqual(["test1/Object1", "test2/Object2"]);
            });

            it("Should resolve the token as an object with a full path", () => {
                expect(codeAnalyzer.isFullUi5Path("sap.m.Tree")).toBe(true);
                expect(codeAnalyzer.isFullUi5Path("sap/m/Tree")).toBe(true);
            });

            it("Should not resolve the token as an object with a full path", () => {
                expect(codeAnalyzer.isFullUi5Path("Label")).toBe(false);
            });

            it("Should return define statement objects", () => {
                const code1 = `sap.ui.define(["sap/m/Label", "sap/m/Text"], function(Label, Text) {
                "use strict";

                init: function() {
                    label.setText("test");
                }
            })`;

                expect(codeAnalyzer.getDefineStatementObjects(code1)).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });

                const messyCode1 = `sap.ui.define([
                "sap/m/Label",
                         "sap/m/Text"],
                            function(Label,
                        Text) {
                "use strict";

                init: function() {
                    label.setText("test");
                }
            })`;

                expect(codeAnalyzer.getDefineStatementObjects(messyCode1)).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });

                const messyCode2 = `sap.ui.define([ /* comment */
                "sap/m/Label", "sap/m/Text"


                    ], //comment
                            function(
                                Label,
                        Text
                    )
                {
                "use strict";

                init: function() {
                    label.setText("test");
                }
            })`;

                expect(codeAnalyzer.getDefineStatementObjects(messyCode2)).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });

                const messyCode3 = `sap.ui.define(
                [
                    /* comment */
                "sap/m/Label"
                ,
                "sap/m/Text"
                    ]
                , //comment
                            function
                    (
                                Label,
                        Text
                    )
                {
                "use strict";

                init: function() {
                    label.setText("test");
                }
            })`;

                expect(codeAnalyzer.getDefineStatementObjects(messyCode3)).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
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
                const scopeCode = codeAnalyzer.getVariableScope(token, position, mockEditor.doc);
                expect(codeAnalyzer.getObjectFromComment(token, position, mockEditor.doc, scopeCode)).toBe(ui5CoreLabelObject);
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
                const scopeCode = codeAnalyzer.getVariableScope(token, position, mockEditor.doc);
                expect(codeAnalyzer.getObjectFromComment(token, position, mockEditor.doc, scopeCode)).toBe(ui5CoreLabelObject);
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
                const scopeCode = codeAnalyzer.getVariableScope(token, position, mockEditor.doc);
                expect(codeAnalyzer.getObjectFromComment(token, position, mockEditor.doc, scopeCode)).toBe(ui5CoreLabelObject);
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
                const scopeCode = codeAnalyzer.getVariableScope(token, position, mockEditor.doc);
                expect(codeAnalyzer.getObjectFromComment(token, position, mockEditor.doc, scopeCode)).toBe(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the comment #5", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    const lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab
                }

                function() {
                    let i = new Label();
                    let lab = new Label();
                    lab
                }
                )}`;

                const token = "lab",
                    position = {
                        line: 2,
                        ch: 0
                    };

                const mockEditor = editorUtils.createMockEditor(code, "javascript");
                const scopeCode = codeAnalyzer.getVariableScope(token, position, mockEditor.doc);
                expect(codeAnalyzer.getObjectFromComment(token, position, mockEditor.doc, scopeCode)).toBe(ui5CoreLabelObject);
            });

            it("Should return the closest match object #1", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab
                }

                function() {
                    let i = new Label();
                    let lab = new Label();
                    lab
                }
            )}`;

                let match;
                const regex = /let lab/g,
                    matches = [];

                do {
                    match = regex.exec(code);
                    if (match) {
                        matches.push(match);
                    }
                } while (match);

                textTool.addSubmatches(matches, code, regex);
                expect(codeAnalyzer.getClosestMatch(260, matches)).toBe(matches[1][0]);
            });

            it("Should return the closest match object #2", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab
                }

                function() {
                    let i = new Label();
                    let lab = new Label();
                    lab
                }
            )}`;

                let match;
                const regex = /let lab/g,
                    matches = [];

                do {
                    match = regex.exec(code);
                    if (match) {
                        matches.push(match);
                    }
                } while (match);

                textTool.addSubmatches(matches, code, regex);
                expect(codeAnalyzer.getClosestMatch(70, matches)).toBe(matches[0][0]);
            });

            it("Should return ui5 path from the object constructor #1", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab
                }

                function() {
                    let i = new Label();
                    let lab = new sap.ui.core.Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.getObjectByConstructor("lab", {
                    line: 8,
                    ch: 0
                }, code)).toEqual([ui5CoreLabelObject]);
            });

            it("Should return ui5 path from the object constructor #2", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    var lab = new sap.m.Label();
                    lab
                }

                function() {
                    let i = new Label();
                    const lab = new Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.getObjectByConstructor("lab", {
                    line: 8,
                    ch: 0
                }, code)).toEqual([ui5CoreLabelObject]);
            });

            it("Should return ui5 path from the object constructor #3", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    const lab = new Label();
                    lab
                }

                function() {
                    let i = new Label();
                    let lab = new sap.m.Label();
                    lab
                }
            )}`;

                expect(codeAnalyzer.getObjectByConstructor("lab", {
                    line: 2,
                    ch: 0
                }, code)).toEqual([ui5CoreLabelObject]);
            });

            it("Should return ui5 path from the object from the define statement #1", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    Label
                }
            )}`;

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #2", () => {
                const code = `sap.ui.define(["sap/ui/core/Label", "sap/m/Label"], function(Label, MLabel) {
                    Label
                }
            )}`;

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #3", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label", "sap/m/Label"], function(Button, Label, MLabel)    {
                    Label
                }
            )}`;

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #4", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label", "sap/m/Label", function(Button, Label, MLabel)    {
                    Label
                }
            )}`;

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #5", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label"], "sap/m/Label", function(Button, Label, MLabel    {
                    Label
                }
            )}`;

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #6", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label", "sap/m/Label"], function(Button, Label, MLabel    {
                    Label
                }
            )}`;

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #7", () => {
                const code = "sap.ui.define(['sap/m/Button', sap/ui/core/Label', 'sap/m/Label'], function(Button, Label, MLabel)";

                expect(codeAnalyzer.getObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
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

            it("Should extract XML namespaces", () => {
                const xml = `<mvc:View controllerName="RESOURCE.PATH.CONTROLLER_NAME"
                                xmlns:html="http://www.w3.org/1999/xhtml"
                                xmlns:mvc="sap.ui.core.mvc"
                                displayBlock="true
                                xmlns="sap.m" xmlns:c="sap.ui.commons">
                            </mvc:View>`;

                expect(codeAnalyzer.extractXmlNamespaces(xml)).toEqual({
                    "root": "sap.m",
                    "mvc": "sap.ui.core.mvc",
                    "html": "http://www.w3.org/1999/xhtml",
                    "c": "sap.ui.commons"
                });
            });
        });
    };
});
