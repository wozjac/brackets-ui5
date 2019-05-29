"use strict";

const variableScope = require("ecma-variable-scope"),
    flatted = require("flatted");

const NODE_DOMAIN = "BracketsUI5";

function init(domainMgr) {
    if (!domainMgr.hasDomain(NODE_DOMAIN)) {
        domainMgr.registerDomain(NODE_DOMAIN, {
            major: 0,
            minor: 1
        });
    }

    domainMgr.registerCommand(
        NODE_DOMAIN,
        "addVariableScope",
        addVariableScope,
        false,
        "Add variable scope info to AST",
        [{
            name: "ast",
            type: "object",
            description: "AST node"
        }],
        [{
            name: "ast",
            type: "object",
            description: "AST node with variable scopes"
        }]
    );
}

function addVariableScope(ast) {
    variableScope(ast);
    return flatted.stringify(ast);
}

exports.init = init;
