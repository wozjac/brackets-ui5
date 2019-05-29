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
                }
            });
        }

        return foundNode;
    }

    function getVariableType(node) {
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

    function getDefineStatementEndPositions(ast, sourceCode) {
        let result, lastPath, lastIdentifier;
        let emptyArray, emptyFunction, offset;

        AcornWalk.fullAncestor(ast, (node, ancestors) => {
            if (node.type === "MemberExpression"
                && node.property
                && node.property.type === "Identifier"
                && (node.property.name === "define"
                    || node.property.name === "require")) {

                const parent = ancestors[ancestors.length - 2];

                if (parent) {
                    try {
                        const paths = parent.arguments[0].elements;

                        if (paths.length > 0) {
                            lastPath = paths[paths.length - 1];
                        } else {
                            //empty, get array end
                            lastPath = parent.arguments[0];
                            emptyArray = true;
                        }
                    } catch (error) {
                        lastPath = null;
                    }

                    try {
                        const identifiers = parent.arguments[1].params;

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
                    } catch (error) {
                        lastIdentifier = null;
                    }

                    if (lastPath && lastIdentifier) {
                        result = {
                            arrayEndLocation: lastPath.loc,
                            functionEndLocation: lastIdentifier.loc,
                            emptyArray,
                            emptyFunction
                        };
                    }
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

    exports.getDefineStatementObjects = getDefineStatementObjects;
    exports.getDefineStatementEndPositions = getDefineStatementEndPositions;
    exports.getVariableType = getVariableType;
    exports.getNodeAt = getNodeAt;
    exports.parseWithScopes = parseWithScopes;
    exports.parse = parse;
});
