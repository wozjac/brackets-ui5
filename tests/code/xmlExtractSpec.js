define((require, exports) => {
    "use strict";

    const xmlExtract = require("src/code/xmlExtract");

    exports.getTests = function () {
        describe("[wozjac.ui5] xmlExtract", () => {
            it("Should extract XML namespaces", () => {
                const xml = `<mvc:View controllerName="RESOURCE.PATH.CONTROLLER_NAME"
                                xmlns:html="http://www.w3.org/1999/xhtml"
                                xmlns:mvc="sap.ui.core.mvc"
                                displayBlock="true
                                xmlns="sap.m" xmlns:c="sap.ui.commons">
                            </mvc:View>`;

                expect(xmlExtract.extractXmlNamespaces(xml)).toEqual({
                    "root": "sap.m",
                    "mvc": "sap.ui.core.mvc",
                    "html": "http://www.w3.org/1999/xhtml",
                    "c": "sap.ui.commons"
                });
            });
        });
    };
});
