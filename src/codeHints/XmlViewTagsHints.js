define((require, exports, module) => {
    "use strict";

    const XmlUtils = brackets.getModule("language/XMLUtils"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        hintsSorter = require("src/codeHints/hintsSorter"),
        hintsRenderer = require("src/codeHints/hintsRenderer"),
        ui5SchemaService = require("src/core/ui5SchemaService"),
        xmlExtract = require("src/code/xmlExtract");

    class TagHints {
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
                if (this.tagInfo.tokenType === XmlUtils.TOKEN_TAG) {
                    if (this.tagInfo.offset >= 0) {
                        if (this.tagInfo.offset === 0) {
                            this.exclusion = this.tagInfo.tagName;
                        } else {
                            this._updateExclusion();
                        }
                        return true;
                    }
                }

                return false;
            } else {
                if (implicitChar === "<") {
                    this.exclusion = this.tagInfo.tagName;
                    return true;
                }
                return false;
            }
        }

        getHints() {
            let query, result, namespace;
            this.tagInfo = XmlUtils.getTagInfo(this.editor, this.editor.getCursorPos());

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_TAG) {
                if (this.tagInfo.offset >= 0) {
                    this._updateExclusion();

                    this.originalQuery = this.tagInfo.token.string.slice(0, this.tagInfo.offset);

                    if (this.originalQuery.indexOf(":") !== -1) {
                        [namespace, query] = this.originalQuery.split(":");
                    } else {
                        query = this.originalQuery;
                    }

                    result = this._getResults(query, namespace);

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
            const start = {
                    line: -1,
                    ch: -1
                },
                end = {
                    line: -1,
                    ch: -1
                };

            const cursor = this.editor.getCursorPos();
            let charCount = 0;
            const namespaceSeparatorIndex = this.originalQuery.indexOf(":");

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_TAG) {
                const textAfterCursor = this.tagInfo.token.string.substr(this.tagInfo.offset);
                if (CodeHintManager.hasValidExclusion(this.exclusion, textAfterCursor)) {
                    charCount = this.tagInfo.offset;
                } else if (namespaceSeparatorIndex !== -1) {
                    charCount = this.tagInfo.token.string.split(":")[1].length;
                } else {
                    charCount = this.tagInfo.token.string.length;
                }
            }

            end.line = start.line = cursor.line;
            start.ch = cursor.ch - this.tagInfo.offset;

            if (namespaceSeparatorIndex !== -1) {
                start.ch = cursor.ch - this.tagInfo.offset + namespaceSeparatorIndex + 1;
            }

            end.ch = start.ch + charCount;

            const insertText = completion.contents().first().text();

            if (this.exclusion || completion !== this.tagInfo.tagName) {
                if (start.ch !== end.ch) {
                    this.editor.document.replaceRange(insertText, start, end);
                } else {
                    this.editor.document.replaceRange(insertText, start);
                }
                this.exclusion = null;
            }

            return false;
        }

        _updateExclusion() {
            let textAfterCursor;
            if (this.exclusion && this.tagInfo) {
                textAfterCursor = this.tagInfo.tagName.substr(this.tagInfo.offset);
                if (!CodeHintManager.hasValidExclusion(this.exclusion, textAfterCursor)) {
                    this.exclusion = null;
                }
            }
        }

        _search(tagQuery, namespace) {
            let result;

            const searchNamespace = (tagQuery, namespace) => {
                const result = [];
                const namespaceObject = ui5SchemaService.tags[namespace];

                for (const object in namespaceObject) {
                    if (object.toLowerCase().startsWith(tagQuery.toLowerCase())) {
                        result.push(hintsRenderer.buildXmlTagHintListEntry({
                            name: object,
                            description: namespaceObject[object].documentation,
                            keyword: namespace
                        }));
                    }
                }

                return result;
            };

            const searchNamespaces = (tagQuery) => {
                let result = [];

                for (const namespace in ui5SchemaService.tags) {
                    result = result.concat(searchNamespace.call(this, tagQuery, namespace));
                }

                return result;
            };

            if (namespace) {
                try {
                    result = searchNamespace(tagQuery, namespace);
                } catch (error) {
                    result = searchNamespaces(tagQuery);
                }
            } else {
                result = searchNamespaces(tagQuery);
            }

            return result;
        }

        _getResults(tagQuery, namespacePrefix) {
            let result, namespace;

            const namespaces = xmlExtract.extractXmlNamespaces(this.editor.document.getText());

            if (Object.keys(namespaces).length === 0) { //no namespaces in the source, full search
                result = this._search(tagQuery);
            } else {
                try {
                    namespace = namespaces[namespacePrefix];

                    if (!namespace) {
                        namespace = namespaces["root"];
                    }

                    result = this._search(tagQuery, namespace);
                } catch (error) {
                    result = this._search(tagQuery); //namespace not found, perform full search
                }
            }

            result.sort(hintsSorter.sortWrappedHintList);

            return result;
        }
    }

    module.exports = TagHints;
});
