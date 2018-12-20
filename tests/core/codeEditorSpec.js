define((require, exports) => {
    "use strict";

    const codeEditor = require("src/editor/codeEditor"),
        utils = require("tests/editorUtils");

    exports.getTests = function () {
        describe("[wozjac.ui5] codeEditor.js", () => {
            it("Should return the whole source code", () => {
                const code = "var m = new Label()\nm = null; /* comment */";
                const document = utils.createMockDocument(code, "javascript");
                expect(codeEditor.getSourceCode(document)).toBe(code);
            });

            it("Should return one line of the source code", () => {
                const code = "var m = new Label()\nm = null; /* comment */";
                const mockEditor = utils.createMockEditor(code, "javascript");
                expect(codeEditor.getSourceCodeAtLine(1, mockEditor.doc)).toBe("m = null; /* comment */");
            });

            it("Should format JS doc with html and corrected headers", () => {
                expect(codeEditor.formatJsDoc("This <h1>is</h1> object{@jsdoc} <p class='css'>with</p> #member <h5>member</h5>.")).toBe("This <h5>is</h5> object with <h5>member</h5>.");
            });

            it("Should format JS doc without any html except headers", () => {
                expect(codeEditor.formatJsDoc("This <h1>is</h1> object{@jsdoc} <p class='css'>with</p> #member <h5>member</h5>.", true)).toBe("This is object with member.");
            });

            it("Should insert provided UI5 object into the current document's position", () => {
                const code = "var m = new Label()\nm = null; /* comment */";
                const mockEditor = utils.createMockEditor(code, "javascript");

                spyOn(mockEditor.editor, "getCursorPos").andReturn({
                    line: 0,
                    ch: 0
                });

                codeEditor.insertAtPosition("sap.m.Label", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe("sap.m.Labelvar m = new Label()\nm = null; /* comment */");
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert provided UI5 object into the current document's position #2", () => {
                const code = "var m = new Label()\nm = null; /* comment */";
                const mockEditor = utils.createMockEditor(code, "javascript");

                spyOn(mockEditor.editor, "getCursorPos").andReturn({
                    line: 1,
                    ch: 9
                });

                codeEditor.insertAtPosition("sap.m.Label", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe("var m = new Label()\nm = null;sap.m.Label /* comment */");
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert provided UI5 object with / into the current document position", () => {
                const code = "var m = new Label()\nm = null; /* comment */";
                const mockEditor = utils.createMockEditor(code, "javascript");

                spyOn(mockEditor.editor, "getCursorPos").andReturn({
                    line: 0,
                    ch: 19
                });

                codeEditor.insertWithSlash("sap.m.Label", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe("var m = new Label()sap/m/Label\nm = null; /* comment */");
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #1", () => {
                const code = `sap.ui.define(["sap/m/Label", "sap/m/Text"], function(Label, Text) {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define(["sap/m/Label", "sap/m/Text","sap/m/Button"], function(Label, Text,Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #2", () => {
                const code = `sap.ui.define([
                "sap/m/Label",
                "sap/m/Text"
                ], function(
                    Label,
                    Text) {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define([
                "sap/m/Label",
                "sap/m/Text"
                ,"sap/m/Button"], function(
                    Label,
                    Text,Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #3", () => {
                const code = `sap.ui.define([
                "sap/m/Label"],
                function(
                    Label,
                    Text
                ) {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define([
                "sap/m/Label","sap/m/Button"],
                function(
                    Label,
                    Text
                ,Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #4", () => {
                const code = `sap.ui.define(["sap/m/Label"],
                function(
                    Label,


                    Text
                ) {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define(["sap/m/Label","sap/m/Button"],
                function(
                    Label,


                    Text
                ,Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #5", () => {
                const code = `sap.ui.define([],
                function() {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define(["sap/m/Button"],
                function(Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #6", () => {
                const code = `sap.ui.define(["path/loadOnly"],
                function() {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define(["path/loadOnly","sap/m/Button"],
                function(Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #7", () => {
                const code = `sap.ui.define([],
                function() {
                "use strict";

                init: function() { }
            })`;

                const codeExpected = `sap.ui.define(["sap/m/Button"],
                function(Button) {
                "use strict";

                init: function() { }
            })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #8", () => {
                const code = "sap.ui.define([\"path/loadOnly\"], function() { } })";
                const codeExpected = "sap.ui.define([\"path/loadOnly\",\"sap/m/Button\"], function(Button) { } })";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #9", () => {
                const code = "sap.ui.define([], function() { } })";
                const codeExpected = "sap.ui.define([\"sap/m/Button\"], function(Button) { } })";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #10", () => {
                const code = "sap.ui.define([], function()";
                const codeExpected = "sap.ui.define([\"sap/m/Button\"], function(Button)";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing define statement #11", () => {
                const code = "sap.ui.define([], function( { } })";
                const codeExpected = "sap.ui.define([\"sap/m/Button\"], function( { } },Button)";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing empty define statement", () => {
                const code = "sap.ui.define([], function( ) { var i = 1})";
                const codeExpected = "sap.ui.define([\"sap/m/Button\"], function( Button) { var i = 1})";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should insert the UI5 object into existing require statement", () => {
                const code = `sap.ui.require([
                "sap/m/Label"],
                function(
                    Label,
                    Text
                ) {
                "use strict";

                init: function() { }
                })`;

                const codeExpected = `sap.ui.require([
                "sap/m/Label","sap/m/Button"],
                function(
                    Label,
                    Text
                ,Button) {
                "use strict";

                init: function() { }
                })`;

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should exit without any error and changes if could not insert UI5 object #1", () => {
                const code = "sap.ui.define([, function() { } })";
                const codeExpected = "sap.ui.define([, function() { } })";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should exit without any error and changes if could not insert UI5 object #2", () => {
                const code = "define([], function() { } })";
                const codeExpected = "define([], function() { } })";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should exit without any error and changes if could not insert UI5 object #3", () => {
                const code = "sap.ui.define([], function { } })";
                const codeExpected = "sap.ui.define([], function { } })";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });

            it("Should exit without any error and changes if could not insert UI5 object #4", () => {
                const code = "sap.ui.define([], function }";
                const codeExpected = "sap.ui.define([], function }";

                const mockEditor = utils.createMockEditor(code, "javascript");
                codeEditor.insertInDefine("sap.m.Button", mockEditor.editor);
                expect(mockEditor.doc.getText()).toBe(codeExpected);
                utils.destroyMockEditor(mockEditor.doc);
            });
        });
    };
});
