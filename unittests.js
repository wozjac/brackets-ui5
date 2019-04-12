define((require) => {
    "use strict";

    const textToolSpec = require("tests/core/textToolSpec"),
        ui5ApiSpec = require("tests/core/ui5ApiSpec"),
        ui5ApiFormatterSpec = require("tests/core/ui5ApiFormatterSpec"),
        codeEditorSpec = require("tests/core/codeEditorSpec"),

        ui5CodeAnalyzerSpec = require("tests/code/ui5CodeAnalyzerSpec"),
        xmlExtractSpec = require("tests/code/xmlExtractSpec"),

        xmlViewHintsSpec = require("tests/providers/xmlViewHintsSpec"),
        ui5CodeHintsSpec = require("tests/providers/ui5CodeHintsSpec"),
        quickDocsSpec = require("tests/providers/quickDocsSpec"),

        odataMockGeneratorSpec = require("tests/features/odataMockGeneratorSpec"),
        docsPanelSpec = require("tests/features/docsPanelSpec"),
        snippetsSpec = require("tests/features/snippetsSpec"),

        i18nReaderSpec = require("tests/features/i18nReaderSpec"),
        jsToolSpec = require("tests/code/jsToolSpec"),
        astToolSpec = require("tests/code/astToolSpec");

    describe("[wozjac.ui5] Brackets UI5: core", () => {
        ui5ApiSpec.getTests();
        ui5ApiFormatterSpec.getTests();
        textToolSpec.getTests();
        codeEditorSpec.getTests();
    });

    describe("[wozjac.ui5] Brackets UI5: providers", () => {
        ui5CodeHintsSpec.getTests();
        xmlViewHintsSpec.getTests();
        quickDocsSpec.getTests();
    });

    describe("[wozjac.ui5] Brackets UI5: features", () => {
        snippetsSpec.getTests();
        odataMockGeneratorSpec.getTests();
        docsPanelSpec.getTests();
    });

    describe("[wozjac.ui5] Brackets UI5: UI5 project", () => {
        i18nReaderSpec.getTests();
    });

    describe("[wozjac.ui5] Brackets UI5: code tools", () => {
        jsToolSpec.getTests();
        ui5CodeAnalyzerSpec.getTests();
        xmlExtractSpec.getTests();
        astToolSpec.getTests();
    });
});
