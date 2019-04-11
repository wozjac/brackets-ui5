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
                                ui5Object = that._getUi5VariableType(node);
                            }
                        } else {
                            ui5Object = null; //TODO: resolve variable shadowing
                        }
                    }
                }
            });

            if (!ui5Object) {
                //direct match with define object?
                ui5Object = jsTool.getUi5ObjectFromDefineStatement(token, this._sourceCode);
            }

            return ui5Object ? [ui5Object] : [];
        }

        _getUi5VariableType(node) {
            const variableType = astTool.getVariableType(node, this._ast);
            return jsTool.getUi5ObjectFromDefineStatement(variableType, this._sourceCode);
        }
    }

    function getObjectByConstructor(token, position, ast) {
        AcornWalk.simple(ast, {

        });

        //const constructorPattern = `${token}[\\s]*=\\s*new\\s*([0-9a-zA-Z_$\\.]*)`,
        //    constructorRegex = new RegExp(constructorPattern, "g"),
        //    fullSourceCode = codeEditor.getSourceCode(document);
        //
        //let ui5Objects = [];
        //
        //const match = constructorRegex.exec(variableCodeScope);
        //
        //if (match) {
        //    const constructorToken = match[1];
        //    if (isFullUi5Path(constructorToken)) {
        //        ui5Objects.push(ui5ApiFinder.findUi5ObjectByName(constructorToken));
        //    } else {
        //        //try to find the full path in define
        //        const defineObject = getObjectFromDefineStatement(constructorToken, fullSourceCode);
        //
        //        if (defineObject) {
        //            ui5Objects.push(defineObject);
        //        } else {
        //            //otherwise try to find using only the name
        //            ui5Objects = ui5Objects.concat(ui5ApiFinder.findUi5ObjectByBasename(constructorToken));
        //        }
        //    }
        //}
        //
        //return ui5Objects;
    }

    module.exports = Ui5CodeAnalyzer;
});
