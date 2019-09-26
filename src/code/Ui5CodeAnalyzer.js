define((require, exports, module) => {
    "use strict";

    const AcornWalk = brackets.getModule("thirdparty/acorn/dist/walk"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        codeEditor = require("src/editor/codeEditor"),
        xmlExtract = require("src/code/xmlExtract"),
        astTool = require("src/code/astTool"),
        ui5Files = require("src/ui5Project/ui5Files"),
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

                //ui5 comment in the current line?
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
                    this._setResolveContext(token, position, parsedCode, comments);
                    return this._resolveToken();
                }).then((objects) => {
                    ui5Objects = objects;

                    //get only 1 object if we have multiple - this is the case for an identifier,
                    //(for example "Label") which could not been besolved to the full path, for example sap.m.Label */
                    if (returnOneObject && ui5Objects.length > 1) {
                        ui5Objects = ui5Objects.filter((ui5Object) => {
                            return ui5Object.name.startsWith("sap.m");
                        });

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

        _resolveContext() {
            return this._context;
        }

        _setResolveContext(token, position, parsedCode, comments) {
            this._context = {
                token,
                position,
                parsedCode,
                comments
            };
        }

        _getUi5ObjectFromCurrentLineComment(token, position) {
            const lines = this._sourceCode.split("\n");
            const line = lines[position.line];
            const commentMatch = line.match(constants.regex.ui5ObjectComment);

            if (commentMatch) {
                return ui5ApiFinder.findUi5ObjectByName(commentMatch[1]);
            }
        }

        _resolveToken() {
            return new Promise((resolve) => {
                //find the node at position
                const nodeInfo = astTool.getNodeAt(this._resolveContext().parsedCode, this._resolveContext().position);

                if (!nodeInfo) {
                    resolve([]);
                }

                this._resolveNode(nodeInfo.node).then((ui5Object) => {
                    if (!ui5Object || ui5Object.length === 0) {
                        //direct match with define object?
                        ui5Object = jsTool.getUi5ObjectFromDefineStatement(this._resolveContext().token, this._resolveContext().parsedCode);

                        if (ui5Object && !Array.isArray(ui5Object)) {
                            ui5Object = [ui5Object];
                        }
                    }

                    resolve(ui5Object ? ui5Object : []);
                });
            });
        }

        _resolveNode(node) {
            switch (node.type) {
                case "Identifier":
                    return this._resolveIdentifierNode(node);
                case "ExpressionStatement":
                    return this._resolveIdentifierNode(node);
                case "MemberExpression":
                    return this._resolveMemberNode(node);
                case "CallExpression":
                    return this._resolveCallNode(node);
                default:
                    return Promise.resolve(null);
            }
        }

        _resolveCallNode(node) {
            return new Promise((resolve) => {
                if (!node) {
                    resolve(null);
                    return;
                }

                const controlId = astTool.getControlIdFromByIdCall(node, this._resolveContext().parsedCode);

                if (!controlId) {
                    resolve(null);
                    return;
                }

                const controllerId = astTool.getControllerId(this._resolveContext().parsedCode);

                if (!controllerId) {
                    resolve(null);
                    return;
                }

                ui5Files.findXmlViewsControllers()
                    .then((viewInfo) => {
                        const view = viewInfo.find((element) => {
                            return element.controllerId === controllerId;
                        });

                        if (!view) {
                            resolve(null);
                            return;
                        }

                        const elementInfo = xmlExtract.findElementById(controlId, view.content);

                        if (!elementInfo) {
                            resolve(null);
                            return;
                        } else {
                            const ui5Object = ui5ApiFinder.findUi5ObjectByName(`${elementInfo.namespace}.${elementInfo.element}`);
                            resolve(ui5Object ? [ui5Object] : []);
                        }
                    }, (error) => {
                        console.log(error);
                        resolve(null);
                    });
            });
        }

        _resolveMemberNode(node) {
            const that = this;

            function walk(startNode) {
                let ui5Object;
                const promises = [];

                AcornWalk.full(startNode, (n) => {
                    switch (n.type) {
                        case "AssignmentExpression":
                            if (n.operator === "="
                                && n.left.property.name === that._resolveContext().token) {

                                switch (n.right.callee.type) {
                                    case "Identifier":
                                        if (jsTool.isFullUi5Path(n.right.callee.name)) {
                                            ui5Object = ui5ApiFinder.findUi5ObjectByName(n.right.callee.name);
                                        } else {
                                            ui5Object = jsTool.getUi5ObjectFromDefineStatement(
                                                n.right.callee.name,
                                                that._resolveContext().parsedCode
                                            );
                                        }

                                        break;
                                    case "MemberExpression":
                                        if (n.right.type === "CallExpression") {
                                            promises.push(that._resolveCallNode(n.right));
                                        }
                                }
                            }

                            break;

                        case "ExpressionStatement":
                            if (n.expression.type === "MemberExpression"
                                && n.expression.object.property
                                && n.expression.object.property.name === that._resolveContext().token) {

                                const ui5ObjectFullPath = astTool.resolveMemberExpression(n.expression.object);

                                if (jsTool.isFullUi5Path(ui5ObjectFullPath)) {
                                    ui5Object = ui5ApiFinder.findUi5ObjectByName(ui5ObjectFullPath);
                                }
                            }

                            break;
                    }
                });

                if (ui5Object) {
                    promises.push(Promise.resolve(ui5Object));
                }

                return promises;
            }

            return new Promise((resolve) => {
                let promises = [];

                if (node._nearestScope.node) {
                    promises = walk(node._nearestScope.node);

                    Promise.all(promises).then((values) => {
                        resolve([].concat(...values));
                    });
                } else {
                    resolve([]);
                }
            });
        }

        _resolveIdentifierNode(node) {
            return new Promise((resolve) => {
                let scopeNode = astTool.getScopeNode(node);

                if (!scopeNode) {
                    resolve([]);
                    return;
                }

                this._findVariableInScope(scopeNode)
                    .then((ui5Object) => {
                        if (ui5Object.length > 0) {
                            resolve(ui5Object);
                            return;
                        }

                        //check for identifier and its scope
                        const identifierNode = astTool.findIdentifierInScope(scopeNode, this._resolveContext().token);
                        scopeNode = astTool.getScopeNode(identifierNode);

                        if (!identifierNode || !scopeNode) {
                            resolve([]);
                            return;
                        }

                        resolve(this._findVariableInScope(scopeNode));
                    });
            });
        }

        _findVariableInScope(scopeNode) {
            const that = this;

            function walk(startNode) {
                let commentMatch, ui5Object;
                const promises = [];

                AcornWalk.simple(startNode, {
                    VariableDeclarator(node) {
                        if (!ui5Object) {
                            if (node.id.name === that._resolveContext().token) {
                                that._resolveContext().comments.forEach((entry) => {
                                    if (entry.loc.start.line === node.loc.start.line) {
                                        //check ui5 comment
                                        commentMatch = entry.value.match(constants.regex.ui5ObjectInComment);

                                        if (commentMatch) {
                                            ui5Object = ui5ApiFinder.findUi5ObjectByName(commentMatch[1]);
                                        }
                                    }
                                });

                                if (!ui5Object) {
                                    promises.push(that._getUi5VariableDeclaratorType(node));
                                }
                            }
                        }
                    }
                });

                if (ui5Object) {
                    promises.push(Promise.resolve(ui5Object));
                }

                return promises;
            }

            return new Promise((resolve) => {
                let promises = [];

                if (Array.isArray(scopeNode.body)) {
                    for (const item of scopeNode.body) {
                        if (item.type === "VariableDeclaration") {
                            promises = walk(item).concat(promises);
                        }
                    }
                } else {
                    promises = walk(scopeNode.body).concat(promises);
                }

                Promise.all(promises).then((values) => {
                    resolve([].concat(...values));
                });
            });
        }

        _getUi5VariableDeclaratorType(node) {
            if (node.init && node.init && node.init.type === "CallExpression") {
                return this._resolveCallNode(node.init);
            }

            return new Promise((resolve) => {
                const variableType = astTool.getVariableDeclaratorType(node, this._resolveContext().parsedCode);

                if (!variableType) {
                    resolve(null);
                    return;
                }

                if (jsTool.isFullUi5Path(variableType)) {
                    resolve(ui5ApiFinder.findUi5ObjectByName(variableType));
                } else {
                    resolve(jsTool.getUi5ObjectFromDefineStatement(variableType, this._resolveContext().parsedCode));
                }
            });
        }
    }

    module.exports = Ui5CodeAnalyzer;
});
