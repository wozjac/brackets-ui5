define((require, exports) => {
    "use strict";

    const ui5ApiService = require("src/core/ui5ApiService"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        fixtures = require("tests/fixtures/ui5Api"),
        testUtils = require("tests/testUtils");

    exports.getTests = function () {
        let ui5ObjectsLoaded,
            ui5ApiIndexLoaded;

        describe("[wozjac.ui5] ui5ApiService.js, ui5ApiFinder.js", () => {
            beforeEach(() => {
                testUtils.mockUi5Api();
                testUtils.mockPreferences();

                ui5ApiService.loadUi5Objects().then(() => {
                    ui5ObjectsLoaded = true;
                });

                ui5ApiService.loadUi5ApiIndex().then(() => {
                    ui5ApiIndexLoaded = true;
                });

                waitsFor(() => {
                    return ui5ObjectsLoaded === true && ui5ApiIndexLoaded === true;
                }, "should load ui5 objects", 500);
            });

            it("Should prepare loaded Ui5 objects", () => {
                expect(ui5ApiService.getUi5Objects()).toEqual(fixtures.ui5ApiObjects);
            });

            it("Should return loaded Ui5 objecs", () => {
                expect(ui5ApiService.getUi5Objects()).toEqual(fixtures.ui5ApiObjects);
            });

            it("Should load API index", () => {
                expect(ui5ApiService._apiIndex).toEqual(fixtures.apiIndex);
            });

            it("Should return UI5 object design API", () => {
                let designApi = null;

                ui5ApiService.getUi5ObjectDesignApi("sap.m.Tree").then((api) => {
                    designApi = api;
                });

                waitsFor(() => {
                    return designApi !== null;
                }, "design api is null", 500);

                runs(() => {
                    expect(designApi).toEqual(fixtures.sapMTreeProcessedApi);
                    expect(ui5ApiService._buffer.length).toBe(1);
                });

                designApi = null;

                ui5ApiService.getUi5ObjectDesignApi("sap.m.Tree").then((api) => {
                    designApi = api;
                });

                waitsFor(() => {
                    return designApi !== null;
                }, "design api is null", 500);

                runs(() => {
                    expect(designApi).toEqual(fixtures.sapMTreeProcessedApi);
                    expect(ui5ApiService._buffer.length).toBe(1);
                });
            });

            it("Should find the object", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    path: "event"
                });
                expect(found).toEqual([fixtures.ui5ApiObjects[0]]);
            });

            it("Should find the object ignoring case", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    path: "Event"
                });
                expect(found).toEqual([fixtures.ui5ApiObjects[0]]);
            });

            it("Should not find the object due to case search", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    path: "event",
                    ignoreCase: false
                });
                expect(found).toEqual(null);
            });

            it("Should return null if object not found", () => {
                const found = ui5ApiFinder.findUi5ApiObjects({
                    path: "button"
                });
                expect(found).toEqual(null);
            });

            it("Should return searched library from API index ignorig case", () => {
                expect(ui5ApiFinder.findUi5Library("sap.m.tree")).toEqual("sap/m");
            });

            it("Should return searched library from API", () => {
                expect(ui5ApiFinder.findUi5Library("sap.m.Tree")).toEqual("sap/m");
            });

            it("Should not return searched library from API index due to case search", () => {
                expect(ui5ApiFinder.findUi5Library("sap.m.tree", false)).toEqual(null);
            });

            it("Should return searched object by path", () => {
                expect(ui5ApiFinder.findUi5ObjectByPath("sap.m.Tree")).toEqual(fixtures.ui5ApiObjects[1]);
            });

            it("Should return searched object by path ignoring case", () => {
                expect(ui5ApiFinder.findUi5ObjectByPath("sap.m.tree")).toEqual(fixtures.ui5ApiObjects[1]);
            });

            it("Should not return searched object by due to case search", () => {
                expect(ui5ApiFinder.findUi5ObjectByPath("sap.m.tree", false)).toEqual(null);
            });

            it("Should return searched object by name ignoring case", () => {
                expect(ui5ApiFinder.findUi5ObjectByName("tree")).toEqual([fixtures.ui5ApiObjects[1]]);
            });

            it("Should return searched object by name", () => {
                expect(ui5ApiFinder.findUi5ObjectByName("Tree")).toEqual([fixtures.ui5ApiObjects[1]]);
            });

            it("Should not return searched object by name due to case search", () => {
                expect(ui5ApiFinder.findUi5ObjectByName("tree", false)).toEqual(null);
            });
        });
    };
});
