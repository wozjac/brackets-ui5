define((require, exports) => {
    "use strict";

    const ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        fixtures = require("tests/fixtures/ui5Api");

    exports.getTests = function () {
        describe("[wozjac.ui5] ui5ApiFormatter.js", () => {
            it("Should return formatted ui5 api object", () => {
                const api = ui5ApiFormatter.getFormattedObjectApi(fixtures.sapUiCoreApi.symbols[0]);
                expect(api).not.toBeNull();
                expect(api.hasConstructorParams).toBe(false);
                expect(api.hasProperties).toBe(false);
                expect(api.hasConstructor).toBe(true);
                expect(api.hasMethods).toBe(true);
                expect(api.hasEvents).toBe(false);
                expect(api.methods.length).toBe(7);
            });
        });
    };
});
