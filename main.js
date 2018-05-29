require.config({
    paths: {
        "text": "lib/text",
        "i18n": "lib/i18n"
    },
    locale: brackets.getLocale()
});

define((require, exports, module) => {
    "use strict";

    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        AppInit = brackets.getModule("utils/AppInit"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        commandHandler = require("src/main/commandHandler"),
        menus = require("src/main/menus"),
        docsPanel = require("src/docsPanel/docsPanel"),
        preferences = require("src/main/preferences"),
        ui5ApiService = require("src/core/ui5ApiService"),
        ui5SchemaService = require("src/core/ui5SchemaService"),
        ui5QuickDocsProvider = require("src/quickDocs/ui5QuickDocsProvider"),
        ui5HintsProvider = require("src/codeHints/ui5HintsProvider");

    AppInit.appReady(() => {
        preferences.initPreferences();
        commandHandler.registerCommands();
        menus.createUi5Menu();
        docsPanel.create();
        EditorManager.registerInlineDocsProvider(ui5QuickDocsProvider.getInlineProvider, 999);
        CodeHintManager.registerHintProvider(ui5HintsProvider.getXmlViewTagsHintsProvider(), ["xml"], 999);
        CodeHintManager.registerHintProvider(ui5HintsProvider.getXmlViewAttributesHintsProvider(), ["xml"], 999);
        CodeHintManager.registerHintProvider(ui5HintsProvider.getUi5CodeHintsProvider(), ["javascript"], 999);

        //wait for all files before initialization
        ProjectManager.getAllFiles().then(() => {
            ui5ApiService.loadUi5Objects();
            ui5ApiService.loadUi5ApiIndex();
            preferences.checkApiVersion();
            ui5SchemaService.initSchemas();
        });
    });

    ExtensionUtils.loadStyleSheet(module, "assets/style.css");
});
