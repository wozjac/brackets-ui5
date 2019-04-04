define((require, exports, module) => {
    "use strict";

    const I18nReader = require("src/ui5Project/I18nReader"),
        modulePath = brackets.getModule("utils/ExtensionUtils").getModulePath(module),
        i18nPath = `${modulePath.replace("/features", "")}fixtures/i18n.properties`;

    exports.getTests = function () {
        describe("[wozjac.ui5] I18nReader.js", () => {
            let i18nReader, fileOpened = false;

            beforeEach(() => {
                i18nReader = new I18nReader(i18nPath);
                i18nReader.open().then(() => {
                    fileOpened = true;
                });

                waitsFor(() => {
                    return fileOpened !== false;
                });
            });

            afterEach(() => {
                i18nReader = undefined;
                fileOpened = false;
            });

            it("Should open properties file", () => {
                expect(i18nReader).toBeTruthy();
                expect(i18nReader.getValues()).toBeTruthy();
            });

            it("Shoud return all values in correct order", () => {
                const expected = [
                    {
                        last: "Lorem Ipsum {0}"
                    },
                    {
                        myKey: "key value 1"
                    },
                    {
                        myKey2: "key value 2"
                    },
                    {
                        other: "Other text"
                    },
                    {
                        other: "Duplicated key"
                    }
                ];

                expect(i18nReader.getValues()).toEqual(expected);
            });

            it("Should return only my... prefixed values", () => {
                const expected = [
                    {
                        myKey: "key value 1"
                    },
                    {
                        myKey2: "key value 2"
                    },
                ];

                expect(i18nReader.getValuesStartingWith("my")).toEqual(expected);
            });
        });
    };
});
