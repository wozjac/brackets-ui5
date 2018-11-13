define((require, exports) => {
    const editorUtils = require("tests/editorUtils"),
        ui5HintsProvider = require("src/codeHints/ui5HintsProvider"),
        xmlViewContent1 = require("text!tests/fixtures/testView1.txt"),
        xmlViewContent2 = require("text!tests/fixtures/testView2.xml"),
        testUtils = require("tests/testUtils"),
        ui5SchemaService = require("src/core/ui5SchemaService"),
        tagsFixture = require("text!tests/fixtures/xmlViewTags.json");

    exports.getTests = function () {
        const insertPoint = {
            line: 6,
            ch: 0
        };

        ui5SchemaService.tags = JSON.parse(tagsFixture);

        function expectHints(provider, editor) {
            expect(provider.hasHints(editor, null)).toBe(true);
            const hintsObj = provider.getHints();
            expect(hintsObj).toBeTruthy();
            return hintsObj.hints;
        }

        function expectNoHints(provider, editor) {
            let result = provider.hasHints(editor, null);

            if (result && provider.getHints().hints.length === 0) {
                result = false;
            }

            expect(result).toBe(false);
        }

        function getTagHintUi5Object(hintObject) {
            return hintObject.contents().first().text();
        }

        function verifyTagHints(hintList, expectedFirstHintObject, expectedPartInObject, excludedObject) {
            expectedFirstHintObject = expectedFirstHintObject || "AbsoluteLayout";
            expect(getTagHintUi5Object(hintList[0])).toBe(expectedFirstHintObject);

            const regex = new RegExp(expectedPartInObject, "i");
            hintList.forEach((hintObject) => {
                expect(getTagHintUi5Object(hintObject).search(regex)).not.toBe(-1);
            });

            if (excludedObject) {
                const excludedRegex = new RegExp(excludedObject, "i");
                hintList.forEach((hintObject) => {
                    expect(getTagHintUi5Object(hintObject).search(excludedRegex)).toBe(-1);
                });
            }
        }

        function selectTagHint(objectName, hintList) {
            return hintList.find((hintObject) => {
                return getTagHintUi5Object(hintObject) === objectName;
            });
        }

        function selectAttributeHint(attributeName, hintList) {
            return hintList.find((hintObject) => {
                return hintObject.contents().first().text() === attributeName;
            });
        }

        function insertHint(hintObject, provider) {
            provider.insertHint(hintObject);
        }

        function verifyAttributeHints(hintList, expectedHints) {
            const attributeNames = hintList.map((element) => {
                return element.contents().first().text();
            });

            attributeNames.sort();
            expectedHints.sort();

            expect(attributeNames).toEqual(expectedHints);
        }

        describe("[wozjac.ui5] UI5 xml hints", () => {
            let testEditor;

            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();
                testEditor = testUtils.createTestEditor(xmlViewContent1, "xml");
            });

            afterEach(() => {
                testUtils.destroyTestEditor(testEditor);
            });

            describe("[wozjac.ui5] xmlViewTagHints.js", () => {
                it("Should hint for < just before existing tag", () => {
                    testEditor.doc.replaceRange("<<", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 1
                    }); // cursor between the two <s

                    const hintList = expectHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                    verifyTagHints(hintList, "ActionListItem");
                });

                it("Should filter hints by part of a tag", () => {
                    testEditor.doc.replaceRange("<But", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 4
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                    verifyTagHints(hintList, "Button", "But");
                });

                it("Should hint for a tag with a namespace", () => {
                    testEditor.doc.replaceRange("<c:inplac", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 9
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                    verifyTagHints(hintList, "InPlaceEdit", "inplac");
                });

                it("Should hint tags only from a namespace", () => {
                    testEditor.doc.replaceRange("<c:", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 3
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                    verifyTagHints(hintList, "AbsoluteLayout", "", "ActionBar");
                });

                it("Should hint all namespaces for a tag with a non-exiting namespace", () => {
                    testEditor.doc.replaceRange("<namespace:Ico", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 14
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                    verifyTagHints(hintList, "IconTabBar", "Ico");
                });

                it("Should return no hints", () => {
                    testEditor.doc.replaceRange("<dfrtg", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 6
                    });

                    expectNoHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                });

                it("Should hint for a cluttered tags", () => {
                    testEditor.doc.replaceRange("<But<Other", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 4
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewTagsHintsProvider(), testEditor.editor);
                    verifyTagHints(hintList, "Button", "But");
                });

                it("Should insert a hint after a bracket", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 1
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("Button", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Button");
                });

                it("Should insert a hint at the beginning", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<Butt", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 1
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("Bar", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Barutt");

                });

                it("Should insert a hint for a part", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<Butt<Other>", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 5
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("Button", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Button<Other>");
                });

                it("Should insert a hint for a partial tag with namespace", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<name:Ic ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 8
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("IconTabBar", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<name:IconTabBar ");
                });

                it("Should insert a hint for a cluttered partial tag with namespace", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<name:Ic<Other> ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 8
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("IconTabBar", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<name:IconTabBar<Other> ");
                });

                it("Should insert a hint a in the middle of a line", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<tag>    </tag>  <But      <Other>", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 20
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("Button", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<tag>    </tag>  <Button      <Other>");
                });

                it("Should insert a hint in the middle of the tag", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();
                    testEditor.doc.replaceRange("<Buttadasdasda> <Other>", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 5
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectTagHint("Button", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Button> <Other>");
                });

                it("Should hint attributes for a tag", () => {
                    testEditor.doc.replaceRange("<CancelAction ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 19
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);
                    verifyAttributeHints(hintList, ["enabled", "press", "visible"]);
                });

                it("Should hint attributes for a tag with a namespace", () => {
                    testEditor.doc.replaceRange("<c:Area ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 8
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);
                    verifyAttributeHints(hintList, ["shape", "coords", "href", "alt"].sort());
                });

                it("Should not hint for a tag", () => {
                    testEditor.doc.replaceRange("<namespace:ComboBoxTextField ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 13
                    });

                    expectNoHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);
                });

                it("Should hint filtered attributes for a tag", () => {
                    testEditor.doc.replaceRange("<c:Button e", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 19
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);
                    verifyAttributeHints(hintList, ["enabled"]);
                });

                it("Should not hint for an attribute", () => {
                    testEditor.doc.replaceRange("<Button enabled=\"true\">", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 16
                    });

                    expectNoHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 17
                    });

                    expectNoHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 18
                    });

                    expectNoHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 20
                    });

                    expectNoHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);
                });

                it("Should hint for a namespaced attributes only", () => {
                    testEditor.doc.replaceRange("<c:Dialog ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 10
                    });

                    const hintList = expectHints(ui5HintsProvider.getXmlViewAttributesHintsProvider(), testEditor.editor);
                    verifyAttributeHints(hintList, ["width", "height", "scrollLeft", "scrollTop", "title", "applyContentPadding", "showCloseButton", "resizable", "minWidth", "minHeight", "maxWidth", "maxHeight", "contentBorderDesign", "modal", "accessibleRole", "keepInWindow", "autoClose", "defaultButton", "initialFocus", "closed", "busy", "busyIndicatorDelay", "busyIndicatorSize", "visible", "fieldGroupIds", "validateFieldGroup"]);
                });

                it("Should insert an attribute hint", () => {
                    const provider = ui5HintsProvider.getXmlViewAttributesHintsProvider();
                    testEditor.doc.replaceRange("<Button ", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 8
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectAttributeHint("enabled", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Button enabled=\"\"");
                });

                it("Should insert an attribute hint after a partial attribute", () => {
                    const provider = ui5HintsProvider.getXmlViewAttributesHintsProvider();
                    testEditor.doc.replaceRange("<Button ena", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 11
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectAttributeHint("enabled", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Button enabled=\"\"");
                });

                it("Should insert an attribute hint leaving existing value", () => {
                    const provider = ui5HintsProvider.getXmlViewAttributesHintsProvider();
                    testEditor.doc.replaceRange("<Button enab=\"value\"", insertPoint);

                    testEditor.editor.setCursorPos({
                        line: 6,
                        ch: 12
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    const hint = selectAttributeHint("enabled", hintList);
                    insertHint(hint, provider);
                    expect(testEditor.doc.getLine(6)).toBe("<Button enabled=\"value\"");
                });
            });

            describe("[wozjac.ui5] UI5 xml hints - no namespaces in the XML", () => {
                let testEditor;

                beforeEach(() => {
                    $("body").append("<div id='editor'/>");
                    testEditor = editorUtils.createMockEditor(xmlViewContent2, "xml");
                });

                afterEach(() => {
                    testEditor.editor.destroy();
                    testEditor = null;
                    $("#editor").remove();
                });

                it("Should hint all tags from all namespaces", () => {
                    const provider = ui5HintsProvider.getXmlViewTagsHintsProvider();

                    testEditor.editor.setCursorPos({
                        line: 3,
                        ch: 5
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    verifyTagHints(hintList);
                    expect(hintList.length).toBe(485);
                });

                it("Should hint attributes for a tag", () => {
                    const provider = ui5HintsProvider.getXmlViewAttributesHintsProvider();
                    spyOn(provider, "_searchAllAttributes").andCallThrough();

                    testEditor.doc.replaceRange("Button", {
                        line: 3,
                        ch: 5
                    });

                    testEditor.editor.setCursorPos({
                        line: 3,
                        ch: 12
                    });

                    const hintList = expectHints(provider, testEditor.editor);
                    expect(hintList.length).toBe(19);
                    expect(provider._searchAllAttributes).toHaveBeenCalled();
                });
            });
        });
    };
});
