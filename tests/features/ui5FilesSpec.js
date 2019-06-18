define((require, exports) => {
    "use strict";

    const ui5Files = require("src/ui5Project/ui5Files");

    const htmlContent = `
        <html><head>
        <meta http-equiv="X-UA-Compatible"
            content="IE=edge" />
        <meta charset="UTF-8">
        <title>My App</title>

        <script id="sap-ui-bootstrap"
            src="resources/sap-ui-cachebuster/sap-ui-core.js"
            data-sap-ui-theme="sap_belize"
            data-sap-ui-appCacheBuster="./"
            data-sap-ui-libs="sap.m"
            data-sap-ui-preload="async"
            data-sap-ui-compatVersion="edge"
            data-sap-ui-resourceroots='{ "my.root.path": "./", "my.other.path": "./view" }'>
        </head></html>`;

    const manifestContent = `
        {
            "_version": "1.2.0",
            "start_url": "index.html",
            "sap.app": {
                "_version": "1.2.0",
                "id": "com.some",
                "type": "application"
            }
        }`;

    function mockManifest() {
        spyOn(ui5Files, "getManifestFile").andReturn(
            new Promise((resolve, reject) => {
                try {
                    const content = JSON.parse(manifestContent);

                    resolve({
                        content
                    });
                } catch (error) {
                    reject("Manifest file parse error");
                }
            })
        );
    }

    function mockIndex() {
        spyOn(ui5Files, "getIndexFile").andReturn(
            new Promise((resolve) => {
                resolve(htmlContent);
            })
        );
    }

    exports.getTests = function () {
        describe("[wozjac.ui5] ui5Files.js", () => {
            it("Should return component ID", () => {
                mockManifest();

                ui5Files.getManifestFile().then((manifestFile) => {
                    expect(ui5Files.getComponentId(manifestFile.content)).toBe("com.some");
                });
            });

            it("Should return resource root path from index", () => {
                mockIndex();

                ui5Files.getIndexFile().then((html) => {
                    console.log(ui5Files.getResourceRootPaths(html));
                });
            });

            it("Should return resource root path from manifest", () => {
                mockManifest();

                ui5Files.getManifestFile().then((manifestObject) => {
                    expect(ui5Files.getResourceRootPaths(null, manifestObject)).toEqual({
                        "com.some": undefined
                    });
                });
            });

            it("Should", () => {
                ui5Files.findXmlViewsControllers();
                expect(true).toBe(false);
            });
        });
    };
});
