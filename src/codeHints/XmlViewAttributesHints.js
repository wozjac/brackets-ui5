define((require, exports, module) => {
    "use strict";

    const XmlUtils = brackets.getModule("language/XMLUtils"),
        ui5SchemaService = require("src/core/ui5SchemaService"),
        codeAnalyzer = require("src/editor/codeAnalyzer"),
        hintsUtils = require("src/codeHints/hintsUtils");

    class AttributeHints {
        constructor() {
            this.tagInfo = null;
            this.editor = null;
            this.exclusion = null;
        }

        hasHints(editor, implicitChar) {
            const cursorPosition = editor.getCursorPos();

            this.editor = editor;
            this.tagInfo = XmlUtils.getTagInfo(editor, cursorPosition);

            if (implicitChar === null) {
                if (this.tagInfo.tokenType === XmlUtils.TOKEN_ATTR) {
                    if (this.tagInfo.offset >= 0) {
                        this.exclusion = this.tagInfo.attrName;
                        return true;
                    }
                }

                return false;
            } else {
                if (implicitChar === " " || implicitChar === "'"
                    || implicitChar === "\"" || implicitChar === "=") {

                    if (this.tagInfo.tokenType === XmlUtils.TOKEN_ATTR) {
                        this.exclusion = this.tagInfo.attrName;
                    }

                    return true;
                }

                return false;
            }
        }

        getHints() {
            let query, result, tag, namespacePrefix;
            this.tagInfo = XmlUtils.getTagInfo(this.editor, this.editor.getCursorPos());

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_ATTR) {
                if (this.tagInfo.offset >= 0) {
                    query = this.tagInfo.token.string.slice(0, this.tagInfo.offset);
                    tag = this.tagInfo.tagName;

                    if (tag.indexOf(":") !== -1) {
                        [namespacePrefix, tag] = tag.split(":");
                    } else {
                        namespacePrefix = "root";
                    }

                    result = this._getResults(query, tag, namespacePrefix);

                    return {
                        hints: result,
                        match: null,
                        selectInitial: true,
                        handleWideResults: false
                    };
                }
            }

            return null;
        }

        insertHint(completion) {
            let textToInsert = completion.contents().first().text();

            const start = {
                    line: -1,
                    ch: -1
                },
                end = {
                    line: -1,
                    ch: -1
                };

            let charCount = 0,
                insertedName = false;

            const cursor = this.editor.getCursorPos();

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_ATTR) {
                charCount = this.tagInfo.offset;

                if (!this.tagInfo.shouldReplace) {
                    textToInsert += "=\"\"";
                    insertedName = true;
                }
            }

            end.line = start.line = cursor.line;
            if (this.tagInfo.token.string.trim().length === 0) {
                start.ch = cursor.ch;
            } else {
                start.ch = cursor.ch - this.tagInfo.offset;
            }

            end.ch = start.ch + charCount;

            if (start.ch !== end.ch) {
                this.editor.document.replaceRange(textToInsert, start, end);
            } else {
                this.editor.document.replaceRange(textToInsert, start);
            }

            if (insertedName) {
                this.editor.setCursorPos(start.line, start.ch + textToInsert.length - 1);
            }

            return false;
        }

        _getResults(attributeQuery, tag, namespacePrefix) {
            let result;
            let namespace;

            const namespaces = codeAnalyzer.extractXmlNamespaces(this.editor.document.getText());

            if (Object.keys(namespaces).length === 0) { //no namespaces in the document, search all
                result = this._searchAllAttributes(attributeQuery, tag);
            } else {
                try {
                    namespace = namespaces[namespacePrefix];
                    result = this._searchTagAttributes(attributeQuery, tag, namespace);
                } catch (error) {
                    //namespace not found, perform full search
                    result = this._searchAllAttributes(attributeQuery, tag);
                }
            }

            result.sort(hintsUtils.sortWrappedHintList);

            return result.filter((elem, pos, arr) => {
                return arr.indexOf(elem) === pos;
            });
        }

        _searchAttributes(attributeQuery, attributes) {
            const result = [];

            if (attributeQuery.trim().length === 0) {
                return attributes.sort(hintsUtils.sortAttributes).map((attribute) => {
                    return hintsUtils.buildHintListEntry({
                        name: attribute.name,
                        description: attribute.documentation
                    });
                });
            } else {
                for (const attribute of attributes) {
                    if (attribute.name.startsWith(attributeQuery)) {
                        result.push(hintsUtils.buildHintListEntry({
                            name: attribute.name,
                            description: attribute.documentation
                        }));
                    }
                }
            }

            return result;
        }

        _searchTagAttributes(attributeQuery, tag, namespace) {
            let result;

            try {
                const attributes = ui5SchemaService.tags[namespace][tag].attributes;
                result = this._searchAttributes(attributeQuery, attributes);
            } catch (error) {
                result = [];
            }

            return result;
        }

        _searchAllAttributes(attributeQuery, tag) {
            const result = [];

            let attributes;

            for (const namespace in ui5SchemaService.tags) {
                for (const object in ui5SchemaService.tags[namespace]) {
                    if (object === tag) {
                        attributes = ui5SchemaService.tags[namespace][object].attributes;

                        if (attributeQuery.trim().length === 0) {
                            return attributes.sort(hintsUtils.sortAttributes).map((attribute) => {
                                return hintsUtils.buildHintListEntry({
                                    name: attribute.name,
                                    description: attribute.documentation
                                });
                            });
                        } else {
                            for (const attribute of attributes) {
                                if (attribute.name.startsWith(attributeQuery)) {
                                    result.push(hintsUtils.buildHintListEntry({
                                        name: attribute.name,
                                        description: attribute.documentation
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            return result;
        }
    }

    module.exports = AttributeHints;
});
