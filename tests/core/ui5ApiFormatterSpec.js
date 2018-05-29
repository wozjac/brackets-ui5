define((require, exports) => {
    const ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        fixtures = require("tests/fixtures/ui5Api");

    exports.getTests = function() {
        describe("[wozjac.ui5] ui5ApiFormatter.js", () => {
            it("Should return formatted ui5 api object", () => {
                const api = ui5ApiFormatter.getFormattedObjectApi(fixtures.sapMTreeProcessedApi);
                expect(api).not.toBeNull();
                expect(api.constructorParams.length).toBe(2);
                expect(api.hasProperties).toBe(false);
                expect(api.hasConstructor).toBe(true);
                expect(api.hasMethods).toBe(true);
                expect(api.hasEvents).toBe(true);
                expect(api.events.length).toBe(1);
                expect(api.methods.length).toBe(11);
            });
        });
    };
});
