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
        }

        resolveUi5Token(token, position, returnOneObject = false) {
            return new Promise((resolve, reject) => {
                const comments = [];
                let ui5Objects = [];

                //check ui5 comment at the cursor position
                const ui5Object = this._getUi5ObjectFromCurrentLineComment(token, position);

                if (ui5Object) {
                    ui5Objects.push(ui5Object);
                    resolve(ui5Objects);
                    return;
                }

                //full ui5 object name?
                if (jsTool.isFullUi5Path(token)) {
                    ui5Objects.push(ui5ApiFinder.findUi5ObjectByName(token));
                    resolve(ui5Objects);
                    return;
                }

                astTool.parseWithScopes(this._sourceCode, {
                    onComment: comments
                }).then((parsedCode) => {
                    ui5Objects = this._resolveToken(token, position, parsedCode, comments);

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

                        if (!ui5Objects) {
                            ui5Objects = [];
                        }
                    }

                    resolve(ui5Objects);
                }, (error) => {
                    reject(error);
                });
            });
        }

        _getUi5ObjectFromCurrentLineComment(token, position) {
            const lines = this._sourceCode.split("\n");
            const line = lines[position.line];
            const commentMatch = line.match(constants.regex.ui5ObjectComment);

            if (commentMatch) {
                return ui5ApiFinder.findUi5ObjectByName(commentMatch[1]);
            }
        }

        _resolveToken(token, position, parsedCode, comments) {
            let ui5Object;

            //find the node at position
            const nodeInfo = astTool.getNodeAt(parsedCode, position);

            if (!nodeInfo) {
                return [];
            }

            ui5Object = this._resolveNode(nodeInfo.node, token, parsedCode, comments);

            if (!ui5Object || ui5Object.length === 0) {
                //direct match with define object?
                ui5Object = jsTool.getUi5ObjectFromDefineStatement(token, parsedCode);

                if (!Array.isArray(ui5Object)) {
                    ui5Object = [ui5Object];
                }
            }

            return ui5Object ? ui5Object : [];
        }

        _resolveNode(node, searchedName, parsedCode, comments) {
            let ui5Object;

            let scopeNode = this._getScopeNode(node);

            if (!scopeNode) {
                return [];
            }

            ui5Object = this._findVariableInScope(scopeNode, searchedName, parsedCode, comments);

            if (ui5Object.length > 0) {
                return ui5Object;
            }

            //check for identifier and its scope
            const identifierNode = this._findIdentifierInScope(scopeNode, searchedName);
            scopeNode = this._getScopeNode(identifierNode);

            if (!identifierNode || !scopeNode) {
                return [];
            }

            ui5Object = this._findVariableInScope(scopeNode, searchedName, parsedCode, comments);

            return ui5Object;
        }

        _findVariableInScope(scopeNode, token, parsedCode, comments) {
            const that = this;
            let ui5Object;

            function walk(startNode) {
                let commentMatch, ui5Object;

                AcornWalk.simple(startNode, {
                    VariableDeclarator(node) {
                        if (!ui5Object) {
                            if (node.id.name === token) {
                                comments.forEach((entry) => {
                                    if (entry.loc.start.line === node.loc.start.line) {
                                        //check ui5 comment
                                        commentMatch = entry.value.match(constants.regex.ui5ObjectInComment);

                                        if (commentMatch) {
                                            ui5Object = ui5ApiFinder.findUi5ObjectByName(commentMatch[1]);
                                        }
                                    }
                                });

                                if (!ui5Object) {
                                    ui5Object = that._getUi5VariableType(node, parsedCode);
                                }
                            }
                        }
                    }
                });

                return ui5Object;
            }

            if (Array.isArray(scopeNode.body)) {
                for (const item of scopeNode.body) {
                    if (item.type === "VariableDeclaration") {
                        ui5Object = walk(item);
                    }
                }
            } else {
                ui5Object = walk(scopeNode.body);
            }

            return ui5Object ? [ui5Object] : [];
        }

        _findIdentifierInScope(scopeNode, token) {
            let foundNode;

            AcornWalk.simple(scopeNode, {
                Identifier(node) {
                    if (node.name === token
                        && node.scope
                        && node.scope.node) {

                        if (!foundNode) {
                            foundNode = node;
                        }
                    }
                }
            });

            return foundNode;
        }

        _getScopeNode(node) {
            if (!node) {
                return null;
            }

            const scope = node.scope || node._nearestScope;

            if (scope) {
                return scope.node;
            }
        }

        _getUi5VariableType(node, parsedCode) {
            const variableType = astTool.getVariableType(node, parsedCode);

            if (jsTool.isFullUi5Path(variableType)) {
                return ui5ApiFinder.findUi5ObjectByName(variableType);
            } else {
                return jsTool.getUi5ObjectFromDefineStatement(variableType, parsedCode);
            }
        }
    }

    module.exports = Ui5CodeAnalyzer;
});
