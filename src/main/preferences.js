define((require, exports) => {
    "use strict";

    const PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        constants = require("src/core/constants"),
        strings = require("strings"),
        prefs = PreferencesManager.getExtensionPrefs(constants.prefs.PREFS_PREFIX);

    function initPreferences() {
        prefs.definePreference(constants.prefs.API_URL, "string", "https://openui5.hana.ondemand.com");
        prefs.definePreference(constants.prefs.USE_SINGLE_QUOTES, "boolean", false);
        prefs.definePreference(constants.prefs.OBJECT_IN_QUOTES, "boolean", false);
        prefs.definePreference(constants.prefs.INSERT_OBJECT_IN_DEFINE, "boolean", false);
        prefs.definePreference(constants.prefs.METADATA_PATH, "string", "localService/metadata.xml");
        prefs.definePreference(constants.prefs.MOCK_DATA_ROOT_URI, "string", "");
        prefs.definePreference(constants.prefs.MOCK_DATA_DIR, "string", "localService/mockData");
        prefs.definePreference(constants.prefs.MOCK_DATA_ENTITY_SIZE, "number", 30);
        prefs.definePreference(constants.prefs.MOCK_DATA_OVERWRITE, "boolean", true);
    }

    function get(key) {
        switch (key) {
            case constants.prefs.API_URL:
                {
                    let apiUrl = prefs.get(constants.prefs.API_URL);
                    if (apiUrl.substring(apiUrl.length - 1) === "/") {
                        apiUrl = apiUrl.slice(0, -1);
                    }
                    return apiUrl;
                }
            default:
                return prefs.get(key);
        }
    }

    function onChange(preference, callback) {
        prefs.on("change", preference, callback);
    }

    function checkApiVersion() {
        const apiString = get(constants.prefs.API_URL).replace(/http(s?):\/\//, "");
        const pathIndex = apiString.lastIndexOf("/");

        if (pathIndex !== -1) {
            const version = apiString.substring(apiString.lastIndexOf("/") + 1);

            if (version && version.length > 0) {
                const versionParts = version.split(".");

                if (versionParts.length !== 3) {
                    console.error(strings.INCORRECT_API_VERSION_STRING);
                    return;
                }
            }
        }
    }

    exports.initPreferences = initPreferences;
    exports.checkApiVersion = checkApiVersion;
    exports.onChange = onChange;
    exports.get = get;
});
