define((require, exports) => {
    "use strict";

    const Menus = brackets.getModule("command/Menus"),
        Strings = require("strings"),
        constants = require("src/core/constants");

    function createUi5Menu() {
        const topUI5menu = Menus.addMenu(Strings.UI5_TOOLS_MENU, constants.commands.TOP_UI5_MENU_ID);
        topUI5menu.addMenuItem(constants.commands.UI5_API_REFERENCE_ID, "Ctrl-2");
        topUI5menu.addMenuItem(constants.commands.GENERATE_ODATA_MOCKS_ID);
        topUI5menu.addMenuDivider();
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET1_ID, "Ctrl-Alt-1");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET2_ID, "Ctrl-Alt-2");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET3_ID, "Ctrl-Alt-3");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET4_ID, "Ctrl-Alt-4");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET5_ID, "Ctrl-Alt-5");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET6_ID, "Ctrl-Alt-6");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET7_ID, "Ctrl-Alt-7");
        topUI5menu.addMenuItem(constants.commands.INSERT_SNIPPET8_ID, "Ctrl-Alt-8");
        topUI5menu.addMenuDivider();
        topUI5menu.addMenuItem(constants.commands.OPEN_SNIPPETS_FOLDER_ID);
    }

    exports.createUi5Menu = createUi5Menu;
});
