define((require, exports, module) => {
    "use strict";

    const AcornLoose = brackets.getModule("thirdparty/acorn/dist/acorn_loose"),
        Acorn = brackets.getModule("thirdparty/acorn/dist/acorn"),
        NodeDomain = brackets.getModule("utils/NodeDomain"),
        AcornWalk = brackets.getModule("thirdparty/acorn/dist/walk"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        constants = require("src/core/constants"),
        flatted = require("src/3rdparty/flatted"),
        variableScopeDomain = new NodeDomain("BracketsUI5", ExtensionUtils.getModulePath(module, "../../node/scopeDomain"));

    function parseWithScopes(sourceCode, options) {
        return new Promise((resolve, reject) => {
            const parsed = parse(sourceCode, options);

            variableScopeDomain.exec("addVariableScope", parsed)
                .done((parsedWithScope) => {
                    resolve(flatted.parse(parsedWithScope));
                })
                .fail((error) => {
                    reject(error);
                });
        });
    }

    function parse(sourceCode, options) {
        let parseOptions = {
            locations: true
        };

        if (options) {
            parseOptions = Object.assign(options, parseOptions);

            if (parseOptions.removeComments) {
                sourceCode = sourceCode.replace(constants.regex.comments, "");
            }
        }

        let parsed;

        try {
            parsed = Acorn.parse(sourceCode, parseOptions);
        } catch (error) {
            parsed = AcornLoose.parse_dammit(sourceCode, parseOptions);
        }

        return parsed;
    }

    function getNodeAt(ast, position, withAncestors = false) {
        let foundNode;

        if (withAncestors) {
            AcornWalk.fullAncestor(ast, (node, ancestors) => {
                if (node.loc.start.column === position.ch
                    && node.loc.start.line === position.line + 1
                    && node.loc.end.line === position.line + 1
                    && node.loc.end.column === position.chEnd) {

                    foundNode = {
                        node: Object.assign({}, node),
                        ancestors: [...ancestors]
                    };
                }
            });
        } else {
            AcornWalk.full(ast, (node) => {
                if (node.loc.start.column === position.ch
                    && node.loc.start.line === position.line + 1
                    && node.loc.end.line === position.line + 1
                    && node.loc.end.column === position.chEnd) {

                    foundNode = {
                        node: Object.assign({}, node)
                    };
                } else if (node.loc.start.line === position.line + 1
                    && node.loc.end.line === position.line + 1
                    && node.loc.end.column === position.chEnd) {

                    foundNode = {
                        node: Object.assign({}, node)
                    };
                }
            });
        }

        return foundNode;
    }

    function getControlIdFromByIdCall(node) {
        let id;

        if (node.type === "CallExpression"
            && node.callee
            && node.callee.object
            && node.callee.object.type === "ThisExpression"
            && node.callee.property
            && node.callee.property.type === "Identifier"
            && node.callee.property.name.toUpperCase().indexOf("BYID") !== -1
            && node.arguments
            && node.arguments.length === 1
            && node.arguments[0].type === "Literal") {

            id = node.arguments[0].value;
        }

        return id;
    }

    function getVariableDeclaratorType(node) {
        let type;

        try {
            switch (node.init.callee.type) {
                case "Identifier":
                    type = node.init.callee.name;
                    break;
                case "MemberExpression": {
                    let currentNode, path = "";
                    currentNode = node.init.callee;

                    while (currentNode) {
                        try {
                            if (path === "") {
                                path = currentNode.property.name;
                            } else {
                                path = `${currentNode.property.name}.${path}`;
                            }

                            currentNode = currentNode.object;
                        } catch (error) {
                            if (currentNode.type === "Identifier") {
                                path = `${currentNode.name}.${path}`;
                            }

                            currentNode = null;
                        }
                    }

                    type = path;
                    break;
                }
            }
        } catch (error) {
            type = null;
        }

        return type;
    }

    function resolveMemberExpression(node) {
        let currentNode, path = "";
        currentNode = node;

        while (currentNode) {
            try {
                if (path === "") {
                    path = currentNode.property.name;
                } else {
                    path = `${currentNode.property.name}.${path}`;
                }

                currentNode = currentNode.object;
            } catch (error) {
                if (currentNode.type === "Identifier") {
                    path = `${currentNode.name}.${path}`;
                }

                currentNode = null;
            }
        }

        return path;
    }

    function getDefineStatementObjects(ast) {
        let result = null;

        AcornWalk.fullAncestor(ast, (node, ancestors) => {
            if (node.type === "MemberExpression"
                && node.property
                && node.property.type === "Identifier"
                && node.property.name === "define") {

                const parent = ancestors[ancestors.length - 2];
                let paths, identifiers;

                if (parent) {
                    try {
                        paths = parent.arguments[0].elements;

                        if (paths.length === 0) {
                            paths = null;
                        }
                    } catch (error) {
                        paths = null;
                    }

                    try {
                        identifiers = parent.arguments[1].params;

                        if (identifiers.length === 0) {
                            identifiers = null;
                        }
                    } catch (error) {
                        identifiers = null;
                    }

                    if (paths && identifiers) {
                        result = {};

                        for (const n in paths) {
                            try {
                                result[identifiers[n].name] = paths[n].value;
                            } catch (error) {
                                //skip missing
                            }
                        }
                    }
                }
            }
        });

        return result;
    }

    function getDefineStatementPositions(ast, sourceCode) {
        let result, lastPath, lastIdentifier, defineArrayBegin, defineArrayEnd, defineArrayTokens;
        let emptyArray, emptyFunction, offset, defineFunctionBegin, defineFunctionEnd, defineFunctionTokens;
        let noFunction = false,
            noArray = false;

        AcornWalk.fullAncestor(ast, (node, ancestors) => {
            if (node.type === "MemberExpression"
                && node.property
                && node.property.type === "Identifier"
                && (node.property.name === "define"
                    || node.property.name === "require")) {

                const parent = ancestors[ancestors.length - 2];

                if (parent) {
                    try {
                        if (parent.arguments[0] && parent.arguments[0].type === "ArrayExpression") {
                            const paths = parent.arguments[0].elements;
                            defineArrayBegin = parent.arguments[0].start;
                            defineArrayEnd = parent.arguments[0].end;

                            defineArrayTokens = paths.filter((token) => {
                                return !!token;
                            });

                            if (paths.length > 0) {
                                lastPath = paths[paths.length - 1];
                            } else {
                                //empty, get array end
                                lastPath = parent.arguments[0];
                                emptyArray = true;
                            }
                        } else {
                            lastPath = null;
                            noArray = true;
                        }
                    } catch (error) {
                        lastPath = null;
                        noArray = true;
                    }

                    try {
                        if (parent.arguments[1]
                            && (parent.arguments[1].type === "FunctionExpression"
                                || parent.arguments[1].type === "ArrowFunctionExpression")) {

                            const identifiers = parent.arguments[1].params;
                            defineFunctionBegin = parent.arguments[1].start;
                            defineFunctionEnd = parent.arguments[1].end;

                            defineFunctionTokens = identifiers.filter((token) => {
                                return !!token;
                            });

                            if (identifiers.length > 0) {
                                lastIdentifier = identifiers[identifiers.length - 1];
                            } else {
                                //empty, get function parens
                                lastIdentifier = parent.arguments[1];

                                if (lastIdentifier.type === "FunctionExpression") {
                                    offset = sourceCode.substring(lastIdentifier.start).indexOf(")");
                                } else if (lastIdentifier.type === "ArrowFunctionExpression") {
                                    offset = 1;
                                }

                                emptyFunction = true;
                            }
                        } else {
                            lastIdentifier = null;
                            noFunction = true;
                        }
                    } catch (error) {
                        lastIdentifier = null;
                        noFunction = true;
                    }

                    result = {
                        arrayStartIndex: defineArrayBegin,
                        arrayEndIndex: defineArrayEnd,
                        arrayEndLocation: lastPath ? lastPath.loc : null,
                        functionStartIndex: defineFunctionBegin,
                        functionEndIndex: defineFunctionEnd,
                        functionEndLocation: lastIdentifier ? lastIdentifier.loc : null,
                        defineFunctionTokens,
                        defineArrayTokens,
                        emptyArray,
                        emptyFunction,
                        noFunction,
                        noArray
                    };
                }
            }
        });

        if (result) {
            if (emptyArray) {
                result.arrayEndLocation.end.column--;
            }

            if (emptyFunction) {
                result.functionEndLocation.end = result.functionEndLocation.start;
                result.functionEndLocation.end.column += offset;
            }

            if (offset === -1) {
                //no function end, clear
                result = null;
            }
        }

        return result;
    }

    function getControllerId(ast) {
        let result;

        AcornWalk.simple(ast, {
            CallExpression(node) {
                if (!result
                    && node.callee
                    && node.callee.object
                    && node.callee.object.name
                    && node.callee.object.name.toLowerCase().indexOf("controller") !== -1
                    && node.callee.property
                    && node.callee.property.name
                    && node.callee.property.name === "extend"
                    && node.arguments
                    && node.arguments[0]
                    && node.arguments[0].type === "Literal"
                    && node.arguments[0].value) {

                    result = node.arguments[0].value;
                }
            }
        });

        return result;
    }

    function findIdentifierInScope(scopeNode, token) {
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

    function getScopeNode(node) {
        if (!node) {
            return null;
        }

        const scope = node.scope || node._nearestScope;

        if (scope) {
            return scope.node;
        }
    }

    exports.getDefineStatementObjects = getDefineStatementObjects;
    exports.getDefineStatementPositions = getDefineStatementPositions;
    exports.getVariableDeclaratorType = getVariableDeclaratorType;
    exports.getControlIdFromByIdCall = getControlIdFromByIdCall;
    exports.getControllerId = getControllerId;
    exports.getNodeAt = getNodeAt;
    exports.getScopeNode = getScopeNode;
    exports.resolveMemberExpression = resolveMemberExpression;
    exports.parseWithScopes = parseWithScopes;
    exports.parse = parse;
    exports.findIdentifierInScope = findIdentifierInScope;
});
