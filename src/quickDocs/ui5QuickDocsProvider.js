define((require, exports) => {
    "use strict";

    const XmlUtils = brackets.getModule("language/XMLUtils"),
        InlineDocsViewer = require("./InlineDocsViewer"),
        ui5CodeAnalyze = require("src/code/ui5CodeAnalyze"),
        codeEditor = require("src/editor/codeEditor"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        xmlExtract = require("src/code/xmlExtract"),
        ui5SchemaService = require("src/core/ui5SchemaService"),
        ui5ApiService = require("src/core/ui5ApiService");

    function inlineProvider(hostEditor, position) {
        const contentType = hostEditor.getLanguageForSelection().getId();

        if (contentType !== "javascript" && contentType !== "xml") {
            return null;
        }

        // no multiline selection
        const selection = hostEditor.getSelection();

        if (selection.start.line !== selection.end.line) {
            return null;
        }

        const token = codeEditor.getToken(position, hostEditor);

        if (!token.string) {
            return null;
        }

        const result = new $.Deferred();

        let ui5ObjectApi;

        switch (contentType) {
            case "javascript": {
                ui5CodeAnalyze.getUi5Type(hostEditor)
                    .then((typeDefinition) => {
                        if (!typeDefinition || !typeDefinition.name) {
                            result.reject();
                            return;
                        }

                        ui5ObjectApi = ui5ApiService.getUi5ObjectDesignApi(typeDefinition.name);
                        result.resolve(_prepareApiWidget(ui5ObjectApi, hostEditor));
                        return;
                    })
                    .catch((error) => {
                        result.reject(error);
                        return;
                    });
                break;
            }
            case "xml": {
                const tagInfo = XmlUtils.getTagInfo(hostEditor, position);

                if (tagInfo.tokenType === XmlUtils.TOKEN_TAG) {
                    const tagData = _extractTagInfo(tagInfo);
                    const namespaces = xmlExtract.extractXmlNamespaces(hostEditor.document.getText());

                    if (Object.keys(namespaces).length === 0) { //no namespaces in the source
                        return null;
                    } else {
                        try {
                            _handleXmlTag(tagData, namespaces)
                                .then((ui5Object) => {
                                    if (ui5Object) {
                                        ui5ObjectApi = ui5ApiService.getUi5ObjectDesignApi(ui5Object);
                                        result.resolve(_prepareApiWidget(ui5ObjectApi, hostEditor));
                                        return;
                                    } else {
                                        result.reject();
                                    }
                                });
                        } catch (error) {
                            return null;
                        }
                    }
                }
            }
        }

        return result.promise();
    }

    function _handleXmlTag(tagData, namespaces) {
        return new Promise((resolve, reject) => {
            try {
                let namespace = namespaces[tagData.namespacePrefix];

                if (!namespace) {
                    namespace = namespaces["root"];
                }

                resolve(_search(tagData.tag, namespace));
            } catch (error) {
                reject();
            }
        });
    }

    function _search(tagName, namespace) {
        const namespaceObject = ui5SchemaService.tags[namespace];

        for (const object in namespaceObject) {
            if (object.toLowerCase() === tagName.toLowerCase()) {
                return `${namespace}.${object}`;
            }
        }
    }

    function _prepareApiWidget(ui5ObjectApi, hostEditor) {
        const templateObjects = [];
        const templateObject = ui5ApiFormatter.getFormattedObjectApi(ui5ObjectApi, false, true);
        templateObjects.push(templateObject);

        const inlineWidget = new InlineDocsViewer(templateObjects);
        inlineWidget.setDescriptionsVisibility();
        inlineWidget.load(hostEditor);

        return inlineWidget;
    }

    function _extractTagInfo(tagInfo) {
        const query = tagInfo.token.string;
        let namespacePrefix, tag;

        if (query.indexOf(":") !== -1) {
            [namespacePrefix, tag] = query.split(":");
        } else {
            tag = query;
        }

        return {
            tag,
            namespacePrefix
        };
    }

    exports.inlineProvider = inlineProvider;
});
