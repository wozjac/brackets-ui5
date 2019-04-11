define((require, exports) => {
    "use strict";

    const jsTool = require("src/code/jsTool"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        testUtils = require("tests/testUtils");

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

        describe("[wozjac.ui5] jsTool.js", () => {
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
                expect(jsTool.extractDefineObjects(undefined)).toBe(null);
                expect(jsTool.extractDefineObjects("")).toBe(null);
            });

            it("Should extract define statement array", () => {
                const result = jsTool.extractDefineObjects("test1/Object1, test2/Object2");
                expect(result).toEqual(["test1/Object1", "test2/Object2"]);
            });

            it("Should resolve the token as an object with a full path", () => {
                expect(jsTool.isFullUi5Path("sap.m.Tree")).toBe(true);
                expect(jsTool.isFullUi5Path("sap/m/Tree")).toBe(true);
            });

            it("Should not resolve the token as an object with a full path", () => {
                expect(jsTool.isFullUi5Path("Label")).toBe(false);
            });

            it("Should return ui5 path from the object from the define statement #1", () => {
                const code = `sap.ui.define(["sap/ui/core/Label"], function(Label) {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #2", () => {
                const code = `sap.ui.define(["sap/ui/core/Label", "sap/m/Label"], function(Label, MLabel) {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #3", () => {
                const code = `sap.ui.define(["sap/m/Button", "sap/ui/core/Label", "sap/m/Label"], function(Button, Label, MLabel)    {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #4", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label", "sap/m/Label", function(Button, Label, MLabel)    {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #5", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label"], "sap/m/Label", function(Button, Label, MLabel    {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #6", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label", "sap/m/Label"], function(Button, Label, MLabel    {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #7", () => {
                const code = "sap.ui.define(['sap/m/Button', 'sap/ui/core/Label', 'sap/m/Label'], function(Button, Label, MLabel)";

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });

            it("Should return ui5 path from the object from the define statement #8", () => {
                const code = `sap.ui.define(["sap/m/Button", sap/ui/core/Label", "sap/m/Label"], (Button, Label, MLabel) => {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #9", () => {
                const code = `sap.ui.define(["sap/m/Button", "sap/ui/core/Label"]", (Button, Label, MLabel) => {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("MLabel", code)).toBeUndefined();
            });

            it("Should return ui5 path from the object from the define statement #10", () => {
                const code = `sap.ui.define(["sap/m/Button", "sap/ui/core/Label"], (Button, Label, MLabel) => {
                    Label
                }
                )}`;

                expect(jsTool.getUi5ObjectFromDefineStatement("Label", code)).toEqual(ui5CoreLabelObject);
            });
        });
    };
});
