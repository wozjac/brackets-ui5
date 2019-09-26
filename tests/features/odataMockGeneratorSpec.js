define((require, exports, module) => {
    "use strict";

    const ProjectManager = brackets.getModule("project/ProjectManager"),
        ODataMockGenerator = require("src/mockGenerator/OdataMockGenerator"),
        modulePath = brackets.getModule("utils/ExtensionUtils").getModulePath(module),
        testUtils = require("tests/testUtils");

    exports.getTests = function () {
        beforeEach(() => {
            testUtils.mockPreferences();

            spyOn(ProjectManager, "getProjectRoot").andReturn({
                fullPath: modulePath.replace("/features", "")
            });
        });

        it("Should create a generator with a defaults", () => {
            const generator = new ODataMockGenerator();
            expect(generator).not.toBeNull();
            expect(generator.rootUri).toBe("/");
            expect(generator._oMetadata).not.toBeFalsy();
            expect(generator._sMetadata).not.toBeFalsy();
        });

        it("Should return mocked data", () => {
            const generator = new ODataMockGenerator("http://myservice");
            expect(generator).not.toBeNull();

            const mockData = generator._getMockData();
            expect(mockData).not.toBeNull();
            expect(mockData.Advertisements.length).toBe(1);
            expect(mockData.Categories.length).toBe(1);
            expect(mockData.PersonDetails.length).toBe(1);
            expect(mockData.Persons.length).toBe(1);
            expect(mockData.ProductDetails.length).toBe(1);
            expect(mockData.Products.length).toBe(1);
            expect(mockData.Suppliers.length).toBe(1);

            expect(mockData.Persons[0].ID).not.toBeNull();
            expect(mockData.Persons[0].Name).not.toBeNull();
            expect(mockData.Persons[0].PersonDetail).not.toBeNull();
            expect(mockData.Persons[0].__metadata.uri.startsWith("http://myservice/Persons(")).toBe(true);
        });
    };
});
