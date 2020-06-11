define((require, exports) => {
    "use strict";

    const CommandManager = brackets.getModule("command/CommandManager"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        DefaultDialogs = brackets.getModule("widgets/DefaultDialogs"),
        snippets = require("src/snippets/snippets"),
        docsPanel = require("src/docsPanel/docsPanel"),
        ODataGenerator = require("src/mockGenerator/OdataMockGenerator"),
        constants = require("src/core/constants"),
        ui5CodeAnalyze = require("src/code/ui5CodeAnalyze"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        strings = require("strings");

    function registerCommands() {
        CommandManager.register(strings.UI5_MENU_API_REFERENCE, constants.commands.UI5_API_REFERENCE_ID, toggleApiReferencePanel);
        CommandManager.register(strings.UI5_MENU_ODATA_GEN, constants.commands.GENERATE_ODATA_MOCKS_ID, generateODataMockData);

        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(1)}`, constants.commands.INSERT_SNIPPET1_ID, snippets.insertSnippet1);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(2)}`, constants.commands.INSERT_SNIPPET2_ID, snippets.insertSnippet2);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(3)}`, constants.commands.INSERT_SNIPPET3_ID, snippets.insertSnippet3);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(4)}`, constants.commands.INSERT_SNIPPET4_ID, snippets.insertSnippet4);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(5)}`, constants.commands.INSERT_SNIPPET5_ID, snippets.insertSnippet5);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(6)}`, constants.commands.INSERT_SNIPPET6_ID, snippets.insertSnippet6);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(7)}`, constants.commands.INSERT_SNIPPET7_ID, snippets.insertSnippet7);
        CommandManager.register(`${strings.INSERT}: ${snippets.getSnippetTitle(8)}`, constants.commands.INSERT_SNIPPET8_ID, snippets.insertSnippet8);

        CommandManager.register(strings.UI5_MENU_OPEN_TEMPL_DIR, constants.commands.OPEN_SNIPPETS_FOLDER_ID, snippets.openSnippetsFolder);

        CommandManager.register(strings.OPEN_OBJECT_IN_PANEL, constants.commands.OPEN_OBJECT_IN_PANEL, openCurrentCursorObjectInApiPanel);
        KeyBindingManager.addBinding(constants.commands.OPEN_OBJECT_IN_PANEL, "Ctrl-3");
    }

    function generateODataMockData() {
        try {
            const mockGenerator = new ODataGenerator();
            mockGenerator.createMockData();
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, strings.MOCK_DIALOG_TITLE, strings.MOCK_DIALOG_DONE);
        } catch (error) {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, strings.MOCK_DIALOG_TITLE, error);
        }
    }

    function toggleApiReferencePanel() {
        const docsPanelObject = docsPanel.get();

        if (docsPanelObject.isVisible()) {
            docsPanelObject.hidePanel();
        } else {
            docsPanelObject.showPanel();
        }
    }

    function openCurrentCursorObjectInApiPanel() {
        ui5CodeAnalyze.getUi5Type()
            .then((typeDefinition) => {
                if (typeDefinition && typeDefinition.name) {
                    const ui5Object = ui5ApiFinder.findUi5ObjectByName(typeDefinition.name);

                    if (ui5Object) {
                        docsPanel.get().openPanelWithUi5Object(ui5Object.name);
                    }
                }
            })
            .catch((error) => {
                console.error(`[wozjac.ui5] ${error}`);
            });
    }

    exports.toggleApiReferencePanel = toggleApiReferencePanel;
    exports.generateODataMockData = generateODataMockData;
    exports.registerCommands = registerCommands;
});
