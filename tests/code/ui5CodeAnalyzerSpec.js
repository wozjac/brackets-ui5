define((require, exports) => {
    "use strict";

    const CodeAnalyzer = require("src/code/Ui5CodeAnalyzer"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
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

        const ui5SapUiNamespace = {
            name: "sap.ui",
            kind: "namespace",
            visibility: "public",
            library: "sap.ui.core",
            apiDocUrl: "https: //openui5.hana.ondemand.com/#/api/sap.ui"
        };

        function expectSapUi5Object(sapUi5Object, code, token, position) {
            let resolvedObjects;
            const testEditor = editorUtils.createMockEditor(code, "javascript");
            const codeAnalyzer = new CodeAnalyzer(testEditor.doc.getText());

            codeAnalyzer.resolveUi5Token(token, position).then((ui5Objects) => {
                resolvedObjects = ui5Objects;
            });

            waitsFor(() => {
                return resolvedObjects;
            });

            runs(() => {
                expect(resolvedObjects[0]).toBe(sapUi5Object);
            });
        }

        describe("[wozjac.ui5] codeAnalyzer.js", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();

                spyOn(ui5ApiFinder, "findUi5ObjectByName").andCallFake((path) => {
                    switch (path) {
                        case "sap.ui.core.Label":
                            return ui5CoreLabelObject;
                        case "sap.m.Label":
                            return ui5LabelObject;
                        case "sap.ui":
                            return ui5SapUiNamespace;
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
                        ch: 0,
                        chEnd: 3
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
            });

            it("Should return ui5 path from the comment #2", () => {
                const code = `function() {
                let i = new Label();\n
                let lab = new sap.m.Label();  //ui5: sap.ui.core.Label
                lab
                }`;

                const token = "lab",
                    position = {
                        line: 3,
                        ch: 0,
                        chEnd: 3
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
            });

            it("Should return ui5 path from the comment #3", () => {
                const code = `function() {
                    let lab = new sap.m.Label();
                }

                function() {
                    let i = new Label();
                    let labk = new Label();  //ui5: sap.ui.core.Label
                    labk
                }
                }`;

                const token = "labk",
                    position = {
                        line: 7,
                        ch: 20,
                        chEnd: 24
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
            });

            it("Should return ui5 path from the comment #4", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new Label();
                }

                function() {
                    let i = new Label();
                    var labk = new Label();  //ui5: sap.ui.core.Label
                    labk
                }
                )}`;

                const token = "labk",
                    position = {
                        line: 7,
                        ch: 20,
                        chEnd: 24
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
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
                        ch: 20,
                        chEnd: 23
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
            });

            it("Should return ui5 path from the object constructor #1", () => {
                const code = `sap.ui.define(["sap/m/Label"], function(Label) {
                    let lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab

                function() {
                        let i = new Label();
                        let labk = new sap.ui.core.Label();
                        lab
                    }
                )}`;

                const token = "lab",
                    position = {
                        line: 7,
                        ch: 24,
                        chEnd: 27
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
            });

            it("Should return ui5 path from the object constructor #2", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    var lab = new sap.m.Label();
                    lab

                function() {
                    let i = new Label();
                    const labk = new Label();
                    lab
                }
                )}`;

                const token = "lab",
                    position = {
                        line: 7,
                        ch: 20,
                        chEnd: 23
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);
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

                const token = "lab",
                    position = {
                        line: 2,
                        ch: 20,
                        chEnd: 23
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
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
                    const labk = new Label(); //ui5: sap.ui.core.Label
                    labk
                }
                )}`;

                const token = "labk",
                    position = {
                        line: 11,
                        ch: 20,
                        chEnd: 24
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
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
                    const labk = new sap.m.Label(); /* ui5:sap.ui.core.Label */
                    labk
                }
                )}`;

                const token = "labk",
                    position = {
                        line: 11,
                        ch: 20,
                        chEnd: 24
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
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
                    const labk = new Label(); /* comment */
                    labk
                }
                )}`;

                const token = "labk",
                    position = {
                        line: 11,
                        ch: 20,
                        chEnd: 24
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);
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
                    const labk = new Label();
                    labk
                }
                )}`;

                const token = "Label",
                    position = {
                        line: 5,
                        ch: 20,
                        chEnd: 25
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);
            });

            it("Should resolve the ui5 token #6", () => {
                const code = `sap.ui.define([
                    "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();

                function() {
                    let i = new Label();
                    const labk = new sap.ui.core.Label();
                    labk
                }
                })`;

                const token = "labk",
                    position = {
                        line: 9,
                        ch: 20,
                        chEnd: 24
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);
            });

            it("Should resolve the ui5 token #7", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    var lab = new sap.m.Label();
                }

                function() {
                    let i = new Label();
                    const labk = new sap.ui.core.Label();
                    labk
                }
                )}`;

                const token = "Label",
                    position = {
                        line: 3,
                        ch: 25,
                        chEnd: 30
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);
            });

            it("Should resolve member variable #1", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    return function Classy(){
                       this.param = new Label();
                       this.param.des
                    }
                }
                )}`;

                const token = "param",
                    position = {
                        line: 6,
                        ch: 28,
                        chEnd: 33
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);
            });

            it("Should resolve member variable #2", () => {
                const code = `sap.ui.define([
                "sap/m/Label", "sap/m/Button"
                ],
                function(Label, Button) {
                    return function Classy(){
                       sap.ui.def
                    }
                }
                )}`;

                const token = "ui",
                    position = {
                        line: 5,
                        ch: 27,
                        chEnd: 29
                    };

                expectSapUi5Object(ui5SapUiNamespace, code, token, position);
            });

            it("Should resolve correctly with various scopes", () => {
                const code = `sap.ui.define(["sap/m/Label"], function (Label) {
                    let lab = new sap.m.Label(); //ui5: sap.ui.core.Label
                    lab

                    function () {
                        let i = new Label();
                        let labk = new sap.ui.core.Label();
                        lab

                        function () {
                            const lab = new Label();
                            lab

                                function () {
                                    function () {
                                        lab
                                    }
                                }
                        }
                    }
                })`;

                let token = "lab",
                    position = {
                        line: 2,
                        ch: 20,
                        chEnd: 23
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);

                token = "lab",
                    position = {
                        line: 7,
                        ch: 24,
                        chEnd: 27
                    };

                expectSapUi5Object(ui5CoreLabelObject, code, token, position);

                token = "lab",
                    position = {
                        line: 11,
                        ch: 28,
                        chEnd: 31
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);

                token = "lab",
                    position = {
                        line: 15,
                        ch: 40,
                        chEnd: 43
                    };

                expectSapUi5Object(ui5LabelObject, code, token, position);
            });
        });
    };
});
