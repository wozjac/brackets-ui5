define((require, exports) => {
    "use strict";

    function sortWrappedHintList(left, right) {
        const leftText = left.contents().first().text();
        const rightText = right.contents().first().text();

        if (leftText < rightText) {
            return -1;
        } else if (leftText === rightText) {
            return 0;
        } else {
            return 1;
        }
    }

    function sortAttributes(left, right) {
        if (left.name < right.name) {
            return -1;
        } else if (left.name === right.name) {
            return 0;
        } else {
            return 1;
        }
    }

    exports.sortWrappedHintList = sortWrappedHintList;
    exports.sortAttributes = sortAttributes;
});
