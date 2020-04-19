define((require, exports, module) => {
    "use strict";

    const XmlUtils = brackets.getModule("language/XMLUtils"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        ui5SchemaService = require("src/core/ui5SchemaService"),
        xmlExtract = require("src/code/xmlExtract"),
        I18nReader = require("src/ui5Project/I18nReader"),
        ui5Files = require("src/ui5Project/ui5Files"),
        hintsRenderer = require("src/codeHints/hintsRenderer"),
        hintsSorter = require("src/codeHints/hintsSorter");

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
                } else if (this.tagInfo.tokenType === XmlUtils.TOKEN_VALUE
                    && this.tagInfo.token.string.indexOf(">") !== -1) {

                    return true;
                }

                return false;
            } else {
                if (implicitChar === " "
                    || implicitChar === "'"
                    || implicitChar === "\""
                    || implicitChar === "=") {

                    if (this.tagInfo.tokenType === XmlUtils.TOKEN_ATTR) {
                        this.exclusion = this.tagInfo.attrName;
                    }

                    return true;
                }

                if (implicitChar === ">") {
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

                    result = this._getAttributes(query, tag, namespacePrefix);

                    return {
                        hints: result,
                        match: null,
                        selectInitial: true,
                        handleWideResults: false
                    };
                }
            }

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_VALUE) {
                //model binding attribute help
                const deferredHints = $.Deferred(), //eslint-disable-line
                    query = this.tagInfo.token.string.slice(0, this.tagInfo.offset),
                    parts = query.split(">"),
                    modelName = parts[0].replace(/['"{}]/g, ""),
                    searchString = parts[1];

                this._getModelHints(modelName, searchString).then((hints) => {
                    if (hints) {
                        deferredHints.resolveWith(null, [hints]);
                    } else {
                        deferredHints.resolveWith(null, []);
                    }
                }, () => {
                    deferredHints.resolveWith(null, []);
                });

                return deferredHints;
            }

            return null;
        }

        insertHint(completion) {
            let textToInsert = completion.contents().first().text();
            const cursor = this.editor.getCursorPos();

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

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_ATTR) {
                charCount = this.tagInfo.offset;

                if (!this.tagInfo.shouldReplace) {
                    textToInsert += "=\"\"";
                    insertedName = true;
                }

                if (this.tagInfo.token.string.trim().length === 0) {
                    start.ch = cursor.ch;
                } else {
                    start.ch = cursor.ch - this.tagInfo.offset;
                }
            }

            if (this.tagInfo.tokenType === XmlUtils.TOKEN_VALUE) {
                if (this.tagInfo.token.string.indexOf(">") !== -1) {
                    const token = this.tagInfo.token.string.replace(/['"]/g, "");
                    const parts = token.split(">");
                    start.ch = this.tagInfo.token.start + parts[0].length + 2;
                    charCount = parts[1].replace(/}/g, "").length;
                } else {
                    start.ch = cursor.ch;
                }
            }

            end.line = start.line = cursor.line;
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

        _getAttributes(attributeQuery, tag, namespacePrefix) {
            let result;
            let namespace;

            const namespaces = xmlExtract.extractXmlNamespaces(this.editor.document.getText());

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

            result.sort(hintsSorter.sortWrappedHintList);

            return result.filter((elem, pos, arr) => {
                return arr.indexOf(elem) === pos;
            });
        }

        _searchAttributes(attributeQuery, attributes) {
            const result = [];

            if (attributeQuery.trim().length === 0) {
                return attributes.sort(hintsSorter.sortAttributes).map((attribute) => {
                    return hintsRenderer.buildXmlTagHintListEntry({
                        name: attribute.name,
                        description: attribute.documentation
                    });
                });
            } else {
                for (const attribute of attributes) {
                    if (attribute.name.startsWith(attributeQuery)) {
                        result.push(hintsRenderer.buildXmlTagHintListEntry({
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
                            return attributes.sort(hintsSorter.sortAttributes).map((attribute) => {
                                return hintsRenderer.buildXmlTagHintListEntry({
                                    name: attribute.name,
                                    description: attribute.documentation
                                });
                            });
                        } else {
                            for (const attribute of attributes) {
                                if (attribute.name.startsWith(attributeQuery)) {
                                    result.push(hintsRenderer.buildXmlTagHintListEntry({
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

        _getModelHints(modelName, searchString) {
            //i18n model?
            function search(reader) {
                let values;

                if (!searchString || searchString === "") {
                    values = reader.getValues();
                } else {
                    values = reader.getValuesStartingWith(searchString);
                }

                return values ? values : [];
            }

            return new Promise((resolve) => {
                ui5Files.getModelInfo(modelName).then((modelInfo) => {
                    if (modelInfo.type === "i18n") {
                        let reader, values;

                        if (CodeHintManager.isOpen()) {
                            //use cached reader
                            values = search(this._cachedReader);
                            resolve(this._prepareI18nValueHints(values));
                        } else {
                            reader = new I18nReader(modelInfo.path);
                            this._cachedReader = reader;

                            reader.open().then(() => {
                                values = search(reader);
                                resolve(this._prepareI18nValueHints(values));
                            });
                        }
                    }
                }, (error) => {
                    console.warn(error);
                    resolve(this._prepareI18nValueHints([]));
                });
            });
        }

        _prepareI18nValueHints(values) {
            if (values === undefined) {
                return;
            }

            const items = [];

            values.forEach((entry) => {

                //skip empty keys
                const keys = Object.keys(entry);

                if (!keys || keys[0] === "") {
                    return;
                }

                let item = {};
                item.name = keys[0];
                item.description = entry[item.name];

                //flatten description if multiple key exists
                if (typeof item.description === "object") {
                    item.description = item.description[0];
                }

                item = hintsRenderer.buildXmlTagHintListEntry(item);
                items.push(item);
            });

            return {
                hints: items,
                match: null,
                selectInitial: true,
                handleWideResults: false
            };
        }
    }

    module.exports = AttributeHints;
});
