define((require, exports) => {
    "use strict";

    const editorUtils = require("tests/editorUtils"),
        constants = require("src/core/constants"),
        prefs = require("src/main/preferences"),
        fixtures = require("tests/fixtures/ui5Api");

    function mockUi5Api() {
        if (!("wasCalled" in $.ajax)) {

            spyOn($, "ajax").andCallFake((options) => {
                const result = new $.Deferred();

                switch (options.url) {
                    case "https://openui5.hana.ondemand.com/docs/api/api-index.json":
                        result.resolve(fixtures.apiIndex);
                        break;
                    case "https://openui5.hana.ondemand.com/docs/api/index.xml":
                        result.resolve(fixtures.ui5Xml);
                        break;
                    case "https://openui5.hana.ondemand.com/test-resources/sap/m/designtime/api.json":
                        result.resolve(fixtures.sapMApi);
                }

                return result.promise();
            });
        }
    }

    function mockPreferences() {
        if (!("wasCalled" in prefs.get)) {
            spyOn(prefs, "get").andCallFake((option) => {
                switch (option) {
                    case constants.prefs.API_URL:
                        return "https://openui5.hana.ondemand.com";
                    case constants.prefs.METADATA_PATH:
                        return "fixtures/metadata.xml";
                    case constants.prefs.MOCK_DATA_ROOT_URI:
                        return "";
                    case constants.prefs.MOCK_DATA_ENTITY_SIZE:
                        return 1;
                }
            });
        }
    }

    function createTestEditor(content, language) {
        $("body").append("<div id='editor'/>");
        const testEditor = editorUtils.createMockEditor(content, language);

        return testEditor;
    }

    function destroyTestEditor(testEditor) {
        testEditor.editor.destroy();
        testEditor = null;
        $("#editor").remove();
    }

    exports.createTestEditor = createTestEditor;
    exports.destroyTestEditor = destroyTestEditor;
    exports.mockUi5Api = mockUi5Api;
    exports.mockPreferences = mockPreferences;
});
