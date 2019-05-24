define((require, exports, module) => {
    "use strict";

    const AcornWalk = brackets.getModule("thirdparty/acorn/dist/walk"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        codeEditor = require("src/editor/codeEditor"),
        astTool = require("src/code/astTool"),
        jsTool = require("src/code/jsTool"),
        constants = require("src/core/constants");

    class Ui5CodeAnalyzer {
        constructor(sourceCode = codeEditor.getSourceCode()) {
            this._sourceCode = sourceCode;

            const comments = [];

            this._ast = astTool.parse(this._sourceCode, {
                onComment: comments
            });

            this._comments = comments;
        }

        resolveUi5Token(token, position, returnOneObject = false) {
            let ui5Objects = [];

            //check ui5 comment at the cursor position
            const ui5Object = this._getUi5ObjectFromCurrentLineComment(token, position);

            if (ui5Object) {
                ui5Objects.push(ui5Object);
                return ui5Objects;
            }

            //full ui5 object name?
            if (jsTool.isFullUi5Path(token)) {
                ui5Objects.push(ui5ApiFinder.findUi5ObjectByName(token));
                return ui5Objects;
            }

            ui5Objects = this._resolve(token, position);

            //get only 1 object if we have multiple - this is the case for an identifier,
            //(for example "Label") which could not been besolved to the full path, for example sap.m.Label */
            if (returnOneObject && ui5Objects.length > 1) {
                ui5Objects = ui5Objects.filter((ui5Object) => {
                    return ui5Object.name.startsWith("sap.m");
                });

                //FIXME: jQuery.sap - resolves to 2 objects, correct the above empty filter result
                if (ui5Objects.length > 1) {
                    const selected = ui5Objects[0];
                    ui5Objects = [];
                    ui5Objects.push(selected);
                }
            }

            return ui5Objects ? ui5Objects : ui5Objects = [];
        }

        _getUi5ObjectFromCurrentLineComment(token, position) {
            const lines = this._sourceCode.split("\n");
            const line = lines[position.line];
            const commentMatch = line.match(constants.regex.ui5ObjectComment);

            if (commentMatch) {
                return ui5ApiFinder.findUi5ObjectByName(commentMatch[1]);
            }
        }

        _resolve(token, position) {
            const that = this;
            let ui5Object, commentMatch;

            //check the variable declaration
            AcornWalk.simple(this._ast, {
                VariableDeclarator(node) {
                    if (node.id.name === token) {
                        if (!ui5Object) {
                            that._comments.forEach((entry) => {
                                if (entry.loc.start.line === node.loc.start.line) {
                                    //check ui5 comment
                                    commentMatch = entry.value.match(constants.regex.ui5ObjectInComment);

                                    if (commentMatch) {
                                        ui5Object = ui5ApiFinder.findUi5ObjectByName(commentMatch[1]);
                                    }
                                }
                            });

                            if (!ui5Object) {
                                //TODO
                                //ui5Object = that._getUi5VariableType(node);
                                ui5Object = null;
                            }
                        } else {
                            ui5Object = null; //TODO: resolve variable shadowing
                        }
                    }
                }
            });

            if (!ui5Object) {
                //direct match with define object?
                ui5Object = jsTool.getUi5ObjectFromDefineStatement(token, this._ast);
            }

            return ui5Object ? [ui5Object] : [];
        }

        _getUi5VariableType(node) {
            const variableType = astTool.getVariableType(node, this._ast);

            if (jsTool.isFullUi5Path(variableType)) {
                return ui5ApiFinder.findUi5ObjectByName(variableType);
            } else {
                return jsTool.getUi5ObjectFromDefineStatement(variableType, this._ast);
            }
        }
    }

    module.exports = Ui5CodeAnalyzer;
});
