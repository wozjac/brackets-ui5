define((require, exports) => {
    "use strict";

    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    function readTextFileSync(referenceModule, filepath) {
        let result = "";
        const path = `${ExtensionUtils.getModulePath(referenceModule)}${filepath}`;

        jQuery.ajax({
            url: path,
            dataType: "text",
            async: false,
            success: (text) => {
                result = text;
            },
            error: (error) => {
                throw error;
            }
        });

        return result;
    }

    exports.readTextFileSync = readTextFileSync;
});
