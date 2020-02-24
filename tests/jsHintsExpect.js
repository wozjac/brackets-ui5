define((require, exports) => {
    "use strict";

    const SAP_LIBRARY_API_OBJECT_NAMES = [
        "sap.ui.base.Object",
        "sap.ui.base.EventProvider",
        "sap.m.Tree",
        "sap.m.ColumnListItem",
        "jQuery.Event",
        "sap.ui"
    ];

    function waitForHints(hintObj, callback) {
        let complete = false,
            hintList = null;

        if (hintObj.hasOwnProperty("hints")) {
            complete = true;
            hintList = hintObj.hints;
        } else {
            hintObj.done((obj) => {
                complete = true;
                hintList = obj.hints;
            });
        }

        waitsFor(() => {
            return complete;
        }, "Expected hints did not resolve", 3000);

        runs(() => {
            callback(hintList);
        });
    }

    function expectNoHints(hintsObject) {
        let rejectedHints = false;

        hintsObject.fail(() => {
            rejectedHints = true;
        });

        waitsFor(() => {
            return rejectedHints;
        }, "Expected hints did not resolve", 3000);

        runs(() => {
            expect(rejectedHints).toEqual(true);
        });
    }

    function expectHintsEntries(hintList, expectedEntries) {
        const hints = hintList.map((element) => {
            return element.find("span.brackets-ui5-hint-name").text();
        });

        expect(hints).toEqual(expectedEntries);
    }

    function selectHint(hintText, hintList) {
        return hintList.find((hintObject) => {
            return hintObject.find("span.brackets-ui5-hint-name").text() === hintText;
        });
    }

    function expectAllLibraryObjectsHintsEntries(hintList) {
        const hints = hintList.map((element) => {
            return element.find("span.brackets-ui5-hint-name").text();
        });

        expect(hints).toEqual(SAP_LIBRARY_API_OBJECT_NAMES);
        return hints;
    }

    function expectHints(provider, sapui5Object, hintsLength, callback) {
        waitForHints(provider.getHints(), (hintList) => {
            expect(provider.proposedUi5Object.basename).toBe(sapui5Object);
            expect(hintList.length).toBe(hintsLength);

            if (callback) {
                callback(hintList);
            }
        });
    }

    exports.expectHints = expectHints;
    exports.expectAllLibraryObjectsHintsEntries = expectAllLibraryObjectsHintsEntries;
    exports.expectHintsEntries = expectHintsEntries;
    exports.waitForHints = waitForHints;
    exports.selectHint = selectHint;
    exports.expectNoHints = expectNoHints;
    exports.SAP_LIBRARY_API_OBJECT_NAMES = SAP_LIBRARY_API_OBJECT_NAMES;
});
