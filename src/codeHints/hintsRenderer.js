define((require, exports) => {
    const strings = require("strings");

    "use strict";

    function buildXmlTagHintListEntry(item) {
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

    function createLibraryObjectHintEntry(apiObject) {
        const entryElement = $("<span>").addClass("brackets-js-hints");
        entryElement.addClass("brackets-js-hints-with-type-details");
        $("<span></span>").text(apiObject.name).appendTo(entryElement).addClass("brackets-ui5-hint-name");

        const documentationLink = $("<a></a>").attr("href", apiObject.apiDocUrl);
        documentationLink.addClass("jshint-link brackets-ui5-hint-doc-link");
        documentationLink.appendTo(entryElement);

        documentationLink.click((event) => {
            event.stopImmediatePropagation();
            event.stopPropagation();
        });

        return entryElement;
    }

    function createObjectMembersHintEntry(type) {
        return function (apiObject) {
            const entryElement = $("<span>").addClass("brackets-js-hints");
            entryElement.addClass("brackets-js-hints-with-type-details");
            $("<span></span>").text(apiObject.name).appendTo(entryElement).addClass("brackets-ui5-hint-name");

            const documentationLink = $("<a></a>").attr("href", apiObject.apiDocUrl);
            documentationLink.addClass("jshint-link brackets-ui5-hint-doc-link");
            documentationLink.appendTo(entryElement);

            documentationLink.click((event) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
            });

            if (type === strings.PROPERTY) {
                $("<span></span>").text(apiObject.type).appendTo(entryElement).addClass("jshint-jsdoc brackets-ui5-hint-type");
            }

            if (type === strings.METHOD) {
                let returnText, methodSignature, parameter, parametersText = "";

                if (apiObject.parameters) {
                    for (let i = 1; i <= apiObject.parameters.length; i++) {
                        parameter = apiObject.parameters[i - 1];
                        parametersText += `${parameter.name} : <span class="brackets-ui5-hint-member-type">${parameter.type}</span>`;

                        if (i !== apiObject.parameters.length) {
                            parametersText += ", ";
                        }
                    }
                }

                methodSignature = `fn(${parametersText})`;

                if (apiObject.returnValue) {
                    if (apiObject.returnValue instanceof Object) {
                        returnText = apiObject.returnValue.type;
                    } else {
                        returnText = apiObject.returnValue;
                    }

                    methodSignature += ` : <span class="brackets-ui5-hint-member-type">${returnText}</span>`;
                }

                $("<span></span>").html(methodSignature).appendTo(entryElement).addClass("jshint-jsdoc brackets-ui5-hint-type");
            }

            if (apiObject.borrowedFrom) {
                $("<span></span>").text(`↑ borrowed from ${apiObject.borrowedFrom} ↑`).addClass("jshint-jsdoc brackets-ui5-hint-borrowed").appendTo(entryElement);
            }

            if (apiObject.description) {
                $("<span></span>").text(apiObject.description.trim()).appendTo(entryElement).addClass("jshint-jsdoc");
            }

            entryElement._ui5Type = type;

            if (type === strings.METHOD && apiObject.parameters) {
                entryElement._ui5Parameters = apiObject.parameters;
            }

            return entryElement;
        };
    }

    function createHintCompletionEntry(hint) {
        const entryElement = $("<span>").addClass("brackets-js-hints");
        entryElement.addClass("brackets-js-hints-with-type-details");
        $("<span></span>").text(hint.value).appendTo(entryElement).addClass("brackets-ui5-hint-name");

        if (hint.url) {
            const documentationLink = $("<a></a>").attr("href", hint.url);
            documentationLink.addClass("jshint-link brackets-ui5-hint-doc-link");
            documentationLink.appendTo(entryElement);

            documentationLink.click((event) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
            });
        }

        if (hint.type) {
            $("<span></span>").text(hint.type).appendTo(entryElement).addClass("jshint-jsdoc brackets-ui5-hint-type");
        }

        if (hint.doc) {
            $("<span></span>").text(hint.doc).appendTo(entryElement).addClass("jshint-jsdoc");
        }

        return entryElement;
    }

    exports.buildXmlTagHintListEntry = buildXmlTagHintListEntry;
    exports.createLibraryObjectHintEntry = createLibraryObjectHintEntry;
    exports.createObjectMembersHintEntry = createObjectMembersHintEntry;
    exports.createHintCompletionEntry = createHintCompletionEntry;
});
