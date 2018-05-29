define((require, exports) => {
    "use strict";

    const snippets = require("src/snippets/snippets"),
        snippetTexts = {
            snippet1: require("text!src/snippets/files/snippet1"),
            snippet2: require("text!src/snippets/files/snippet2"),
            snippet3: require("text!src/snippets/files/snippet3"),
            snippet4: require("text!src/snippets/files/snippet4"),
            snippet5: require("text!src/snippets/files/snippet5"),
            snippet6: require("text!src/snippets/files/snippet6"),
            snippet7: require("text!src/snippets/files/snippet7"),
            snippet8: require("text!src/snippets/files/snippet8")
        },
        testUtils = require("tests/testUtils");

    function setSnippetTexts() {
        let text;
        for (let i = 1; i <= 8; i++) {
            text = snippetTexts[`snippet${i}`];
            snippetTexts[`snippet${i}`] = text.substring(text.indexOf("\n") + 1);
        }
    }

    exports.getTests = function () {
        setSnippetTexts();

        describe("[wozjac.ui5] snippets.js - javascript/JSON snippets", () => {
            const line1 = "/* line 1 */",
                newline = "\n";
            let testEditor;

            beforeEach(() => {
                $("body").append("<div id='editor'/>");
                testEditor = testUtils.createTestEditor(line1 + newline, "js");

                spyOn(snippets, "insertSnippet7");
                spyOn(snippets, "insertSnippet8");
            });

            afterEach(() => {
                testUtils.destroyTestEditor(testEditor);
            });

            it("Should insert the snippet1 starting from the second line", () => {
                testEditor.editor.setCursorPos({
                    line: 1,
                    ch: 0
                });

                snippets.insertSnippet1(testEditor.editor);
                expect(testEditor.doc.getText()).toBe(`${line1}${newline}${snippetTexts.snippet1}`);
            });

            it("Should insert the snippet6 after the comment in the first line", () => {
                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 12
                });

                snippets.insertSnippet6(testEditor.editor);
                expect(testEditor.doc.getText()).toBe(`${line1}${snippetTexts.snippet6}${newline}`);
            });

            it("Should insert the snippet3 at the beginning", () => {
                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 0
                });

                snippets.insertSnippet3(testEditor.editor);
                expect(testEditor.doc.getText()).toBe(`${snippetTexts.snippet3}${line1}${newline}`);
            });

            it("Should insert the snippet5 at the beginning", () => {
                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 0
                });

                snippets.insertSnippet5(testEditor.editor);
                expect(testEditor.doc.getText()).toBe(`${snippetTexts.snippet5}${line1}${newline}`);
            });

            it("Should insert the snippet7", () => {
                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 0
                });

                snippets.insertSnippet7(testEditor.editor);
                expect(snippets.insertSnippet7).toHaveBeenCalled();
            });

            it("Should insert the snippet8", () => {
                testEditor.editor.setCursorPos({
                    line: 0,
                    ch: 0
                });

                snippets.insertSnippet8(testEditor.editor);
                expect(snippets.insertSnippet8).toHaveBeenCalled();
            });

            describe("[wozjac.ui5] snippets.js - XML snippets", () => {
                const line1 = "/* line 1 */",
                    newline = "\n";
                let testEditor;

                beforeEach(() => {
                    $("body").append("<div id='editor'/>");
                    testEditor = testUtils.createTestEditor(line1 + newline, "xml");
                });

                afterEach(() => {
                    testUtils.destroyTestEditor(testEditor);
                });

                it("Should insert the snippet4 starting from the second line", () => {
                    testEditor.editor.setCursorPos({
                        line: 1,
                        ch: 0
                    });

                    snippets.insertSnippet4(testEditor.editor);
                    expect(testEditor.doc.getText()).toBe(`${line1}${newline}${snippetTexts.snippet4}`);
                });
            });

            describe("[wozjac.ui5] snippets.js - HTML snippets", () => {
                const line1 = "/* line 1 */",
                    newline = "\n";
                let testEditor;

                beforeEach(() => {
                    $("body").append("<div id='editor'/>");
                    testEditor = testUtils.createTestEditor(line1 + newline, "html");
                });

                afterEach(() => {
                    testUtils.destroyTestEditor(testEditor);
                });

                it("Should insert the snippet2 after the comment in the first line", () => {
                    testEditor.editor.setCursorPos({
                        line: 0,
                        ch: 12
                    });

                    snippets.insertSnippet2(testEditor.editor);
                    expect(testEditor.doc.getText()).toBe(`${line1}${snippetTexts.snippet2}${newline}`);
                });
            });
        });
    };
});
