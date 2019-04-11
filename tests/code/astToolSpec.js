define((require, exports) => {
    "use strict";

    const astTool = require("src/code/astTool");

    exports.getTests = function () {
        describe("[wozjac.ui5] jsTool.js", () => {
            it("Should return define statement objects #1", () => {
                const code = `sap.ui.define(["sap/m/Label", "sap/m/Text"], function(Label, Text) {
                "use strict";

                init: function() {
                    label.setText("test");
                }
                })`;

                expect(astTool.getDefineStatementObjects(astTool.parse(code))).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });
            });

            it("Should return define statement objects #2", () => {
                const messyCode = `sap.ui.define([
                "sap/m/Label",
                         "sap/m/Text"],
                function(Label,
                    Text) {
                "use strict";

                init: function() {
                    label.setText("test");
                }
                })`;

                expect(astTool.getDefineStatementObjects(astTool.parse(messyCode))).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });
            });

            it("Should return define statement objects #3", () => {
                const messyCode = `sap.ui.define([ /* comment */
                "sap/m/Label", "sap/m/Text"


                    ], //comment
                            function(
                                Label,
                        Text
                    )
                {
                "use strict";

                function a() {
                    label.setText("test");
                }
                })`;

                expect(astTool.getDefineStatementObjects(astTool.parse(messyCode, {
                    removeComments: true
                }))).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });
            });

            it("Should return define statement objects #4", () => {
                const messyCode = `sap.ui.define(
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

                function b() {
                    label.setText("test");
                }
                })`;

                expect(astTool.getDefineStatementObjects(astTool.parse(messyCode, {
                    removeComments: true
                }))).toEqual({
                    Label: "sap/m/Label",
                    Text: "sap/m/Text"
                });
            });

            it("Should return a closing bracket position for define statement in correct code #1", () => {
                const code = `sap.ui.define(["sap/m/Label", "sap/m/Text"], function(Label, Text) {
                "use strict";

                function a() {
                    label.setText("test");
                }
                })`;

                const defineEnd = astTool.getDefineStatementEndPositions(astTool.parse(code));

                expect(defineEnd.arrayEndLocation.end.line).toEqual(1);
                expect(defineEnd.arrayEndLocation.end.column).toEqual(42);
                expect(defineEnd.arrayEnd).toEqual(42);
                expect(defineEnd.functionEndLocation.end.line).toEqual(1);
                expect(defineEnd.functionEndLocation.end.column).toEqual(65);
                expect(defineEnd.functionEnd).toEqual(65);
            });

            it("Should return a closing bracket position for define statement in code with invalid syntax #1", () => {
                const code = `sap.ui.define(["sap/m/Label", "sap/m/Text"], function(Label, Text) {
                "use strict";

                init: function() {
                    label.setText("test");
                }
                })`;

                const defineEnd = astTool.getDefineStatementEndPositions(astTool.parse(code));
                expect(defineEnd.arrayEndLocation.end.line).toEqual(1);
                expect(defineEnd.arrayEndLocation.end.column).toEqual(42);
                expect(defineEnd.arrayEnd).toEqual(42);
                expect(defineEnd.functionEndLocation.end.line).toEqual(1);
                expect(defineEnd.functionEndLocation.end.column).toEqual(65);
                expect(defineEnd.functionEnd).toEqual(65);
            });

            it("Should return a closing bracket position for define statement in correct code #2", () => {
                const code = `sap.ui.define([
                    "sap/m/Label",
                    "sap/m/Text"
                ], function(Label, Text) {
                "use strict";

                function a() {
                    label.setText("test");
                }
                })`;

                const defineEnd = astTool.getDefineStatementEndPositions(astTool.parse(code));

                expect(defineEnd.arrayEndLocation.end.line).toEqual(3);
                expect(defineEnd.arrayEndLocation.end.column).toEqual(32);
                expect(defineEnd.arrayEnd).toEqual(84);
                expect(defineEnd.functionEndLocation.end.line).toEqual(4);
                expect(defineEnd.functionEndLocation.end.column).toEqual(39);
                expect(defineEnd.functionEnd).toEqual(124);
            });

            it("Should return a closing bracket position for require statement in correct code #1", () => {
                const code = `sap.ui.define([
                    "sap/m/Label",
                    "sap/m/Text"
                ], function(Label, Text) {
                "use strict";

                function a() {
                    label.setText("test");
                }
                })`;

                const requireEnd = astTool.getDefineStatementEndPositions(astTool.parse(code));

                expect(requireEnd.arrayEndLocation.end.line).toEqual(3);
                expect(requireEnd.arrayEndLocation.end.column).toEqual(32);
                expect(requireEnd.arrayEnd).toEqual(84);
                expect(requireEnd.functionEndLocation.end.line).toEqual(4);
                expect(requireEnd.functionEndLocation.end.column).toEqual(39);
                expect(requireEnd.functionEnd).toEqual(124);
            });
        });
    };
});
