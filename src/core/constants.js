define((require, exports) => {
    "use strict";

    const preferences = {
        PREFS_PREFIX: "bracketsUi5",
        API_URL: "apiUrl",
        OBJECT_IN_QUOTES: "objectPathsInQuotes",
        USE_SINGLE_QUOTES: "useSingleQuotes",
        INSERT_OBJECT_IN_DEFINE: "insertObjectsInDefine",
        METADATA_PATH: "metadataPath",
        MOCK_DATA_ROOT_URI: "mockDataRootUri",
        MOCK_DATA_DIR: "mockDataDir",
        MOCK_DATA_ENTITY_SIZE: "mockDataEntitySize",
        MOCK_DATA_OVERWRITE: "mockDataOverwrite",
        INSERT_METHOD_SIGNATURE: "insertMethodSignature" //not used for now
    };

    const commands = {
        TOP_UI5_MENU_ID: "wozjac.ui5.ui5Menu",
        INSERT_DEFINE_COMMAND_ID: "wozjac.ui5.ui5Menu.insertDefine",
        INSERT_SNIPPET1_ID: "wozjac.ui5.ui5Menu.insertSnippet1",
        INSERT_SNIPPET2_ID: "wozjac.ui5.ui5Menu.insertSnippet2",
        INSERT_SNIPPET3_ID: "wozjac.ui5.ui5Menu.insertSnippet3",
        INSERT_SNIPPET4_ID: "wozjac.ui5.ui5Menu.insertSnippet4",
        INSERT_SNIPPET5_ID: "wozjac.ui5.ui5Menu.insertSnippet5",
        INSERT_SNIPPET6_ID: "wozjac.ui5.ui5Menu.insertSnippet6",
        INSERT_SNIPPET7_ID: "wozjac.ui5.ui5Menu.insertSnippet7",
        INSERT_SNIPPET8_ID: "wozjac.ui5.ui5Menu.insertSnippet8",
        OPEN_SNIPPETS_FOLDER_ID: "wozjac.ui5.ui5Menu.openSnippetsFolder",
        UI5_API_REFERENCE_ID: "wozjac.ui5.ui5Menu.apiReference",
        GENERATE_ODATA_MOCKS_ID: "wozjac.ui5.ui5Menu.generateOdataMocks",
        OPEN_OBJECT_IN_PANEL: "wozjac.ui5.openObjectInPanel"
    };

    const regex = {
        xmlNamespace: /xmlns\s*:?\s*(\w*)\s*=\s*['"]([\w.:/]+)/gi,
        ui5ObjectComment: /\/\/\s*ui5:\s*([\w.]+)/,
        ui5ObjectInComment: /ui5:\s*([\w.]+)/,
        comments: /(\/\*.*\*\/)|(\/\/.*)/g,
        headingsTags: /(<\/?h)(\d)(>)/gi,
        tagsAttributes: /<(\w+)(.|[\r\n])*?>/g,
        htmlTagsWoHeaders: /<[^>h\d]+>/ig,
        htmlTags: /<[^>]+>/ig,
        jsFilesRegex: /^(?!.*controller\.js).*\.js$/,
        controllerFilesRegex: /\w+.controller.js/
    };

    const memberGroupFilter = {
        methods: "m",
        properties: "p",
        events: "e",
        aggregations: "a",
        construct: "c"
    };

    exports.prefs = preferences;
    exports.commands = commands;
    exports.regex = regex;
    exports.memberGroupFilter = memberGroupFilter;
});
