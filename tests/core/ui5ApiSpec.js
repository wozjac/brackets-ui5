define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        fixtures = require("tests/fixtures/ui5Api"),
        testUtils = require("tests/testUtils");

    exports.getTests = function () {
        let ui5ObjectsLoaded,
            ui5LibrariesLoaded;

        describe("[wozjac.ui5] ui5ApiService.js, ui5ApiFinder.js", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();

                ui5ApiService.loadUi5Objects().then(() => {
                    ui5ObjectsLoaded = true;
                    ui5ApiService.loadUi5LibrariesDesignApi().then(() => {
                        ui5LibrariesLoaded = true;
                    });
                });

                waitsFor(() => {
                    return ui5ObjectsLoaded === true && ui5LibrariesLoaded === true;
                }, "should load ui5 objects", 500);
            });

            it("Should return loaded Ui5 objecs", () => {
                expect(ui5ApiService.getUi5Objects()).toEqual(fixtures.ui5ApiObjects);
            });

            it("Should return UI5 object design API", () => {
                let designApi = ui5ApiService.getUi5ObjectDesignApi("sap.ui.base.EventProvider");
                expect(ui5ApiService._buffer.length).toBe(1);
                expect(designApi.apiDocUrl).toEqual("https://openui5.hana.ondemand.com/#/api/sap.ui.base.EventProvider");
                designApi = ui5ApiService.getUi5ObjectDesignApi("sap.ui.base.EventProvider");
                expect(ui5ApiService._buffer.length).toBe(1);
                expect(designApi.apiDocUrl).toEqual("https://openui5.hana.ondemand.com/#/api/sap.ui.base.EventProvider");
                designApi = ui5ApiService.getUi5ObjectDesignApi("sap.ui.base.Object");
                expect(ui5ApiService._buffer.length).toBe(2);
                expect(designApi.apiDocUrl).toEqual("https://openui5.hana.ondemand.com/#/api/sap.ui.base.Object");
            });

            it("Should find the object", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    name: "event"
                });
                expect(found[0]).toEqual(fixtures.ui5ApiObjects["sap.ui.base.EventProvider"]);
            });

            it("Should find the object ignoring case", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    name: "Event"
                });
                expect(found[0]).toEqual(fixtures.ui5ApiObjects["sap.ui.base.EventProvider"]);
            });

            it("Should not find the object due to case search", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    name: "event",
                    ignoreCase: false
                });
                expect(found).toEqual(null);
            });

            it("Should return null if object not found", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    name: "button"
                });
                expect(found).toEqual(null);
            });

            it("Should return searched object by name", () => {
                expect(ui5ApiFinder.findUi5ObjectByName("sap.m.Tree")).toEqual(fixtures.ui5ApiObjects["sap.m.Tree"]);
            });

            it("Should return searched object by name ignoring case", () => {
                expect(ui5ApiFinder.findUi5ObjectByName("sap.m.tree")).toEqual(fixtures.ui5ApiObjects["sap.m.Tree"]);
            });

            it("Should not return searched object by due to case search", () => {
                expect(ui5ApiFinder.findUi5ObjectByName("sap.m.tree", false)).toEqual(null);
            });

            it("Should return searched object by basename ignoring case", () => {
                expect(ui5ApiFinder.findUi5ObjectByBasename("tree")).toEqual([fixtures.ui5ApiObjects["sap.m.Tree"]]);
            });

            it("Should return searched object by basename", () => {
                expect(ui5ApiFinder.findUi5ObjectByBasename("Tree")).toEqual([fixtures.ui5ApiObjects["sap.m.Tree"]]);
            });

            it("Should not return searched object by basename due to case search", () => {
                expect(ui5ApiFinder.findUi5ObjectByBasename("tree", false)).toEqual(null);
            });
        });
    };
});
