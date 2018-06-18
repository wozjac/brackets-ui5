define((require, exports) => {
    "use strict";

    function buildHintListEntry(item) {
        const entryElement = $("<span>").addClass("brackets-js-hints");
        $(`<span>${item.name}</span>`).appendTo(entryElement).addClass("brackets-ui5-hint-name");
        entryElement.addClass("brackets-js-hints-with-type-details");

        if (item.keyword) {
            $(`<span>${item.keyword}</span>`).appendTo(entryElement).addClass("brackets-js-hints-keyword");
        }

        if (item.description) {
            $("<span></span>").text(item.description.trim()).appendTo(entryElement).addClass("jshint-jsdoc");
        }

        return entryElement;
    }

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

    exports.buildHintListEntry = buildHintListEntry;
    exports.sortWrappedHintList = sortWrappedHintList;
    exports.sortAttributes = sortAttributes;
});
