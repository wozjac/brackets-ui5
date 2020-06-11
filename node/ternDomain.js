"use strict";

const Tern = require("tern"),
    browserDefs = require("tern/defs/browser"),
    ecmascript = require("tern/defs/ecmascript"),
    jQuery = require("tern/defs/jquery"),
    Infer = require("tern/lib/infer");

require("tern/plugin/requirejs");

const DOMAIN_NAME = "BracketsUi5Tern";
const logPrefix = "[wozjac.ui5]";

const TERN_COMMANDS = {
    TERN_UPDATE_FILE_MSG: "TernUpdateFile",
    TERN_WORKER_READY: "TernWorkerReady",
    TERN_INIT_MSG: "TernInit",
    TERN_ADD_FILES_MSG: "TernAddFiles",
    TERN_COMPLETIONS_MSG: "TernCompletions",
    TERN_TYPE_MSG: "TernType"
};

const config = {
    debug: true
};

let _domainManager,
    ternServer = null;

function init(domainManager) {
    if (!domainManager.hasDomain(DOMAIN_NAME)) {
        _debug(`Registering domain ${DOMAIN_NAME}`);

        domainManager.registerDomain(DOMAIN_NAME, {
            major: 0,
            minor: 1
        });
    }

    _domainManager = domainManager;

    domainManager.registerCommand(
        DOMAIN_NAME, // domain name
        "invokeTernCommand", // command name
        _invokeTernCommand, // command handler function
        false, // this command is synchronous in Node
        "Invokes a tern command on node",
        [{
            name: "commandConfig", // parameters
            type: "object",
            description: "Object containing tern command configuration"
        }]
    );

    domainManager.registerCommand(
        DOMAIN_NAME,
        "resetTernServer", //command name
        _resetTernServer,
        true, //this command is synchronous in Node
        "Resets an existing tern server"
    );

    domainManager.registerEvent(
        DOMAIN_NAME,
        "ternCompletionsEvent", //event name
        [{
            name: "ternResponse",
            type: "object",
            description: "Tern completions response"
        }]
    );

    domainManager.registerEvent(
        DOMAIN_NAME,
        "ternTypeEvent", //event name
        [{
            name: "ternResponse",
            type: "object",
            description: "Tern type recognition response"
        }]
    );
}

function _invokeTernCommand(commandConfig) {
    try {
        const type = commandConfig.commandType;
        const options = commandConfig.options;

        _debug(`Message received ${type}`);

        switch (type) {
            case TERN_COMMANDS.TERN_INIT_MSG:
                _handleInitTernServer(options.definitions, options.requireJsDefinitions, options.files);
                break;
            case TERN_COMMANDS.TERN_ADD_FILES_MSG:
                _handleAddFiles(options.files);
                break;
            case TERN_COMMANDS.TERN_UPDATE_FILE_MSG:
                _handleUpdateFile(options.filename, options.text);
                break;
            case TERN_COMMANDS.TERN_COMPLETIONS_MSG:
                _handleGetTernHints(options.filename, options.offset);
                break;
            case TERN_COMMANDS.TERN_TYPE_MSG:
                _handleGetType(options.filename, options.offset);
                break;
            default:
                console.warn(`${logPrefix} Unknown message: ${JSON.stringify(options.type)}`);
        }
    } catch (error) {
        console.error(`${logPrefix} ${error}`);
    }
}

function _handleInitTernServer(definitions, requireJsDefinitions, files) {
    _debug("Init server command handler");

    definitions = definitions || {};
    requireJsDefinitions = requireJsDefinitions || {};
    files = files || [];

    //_debug(`Passed definitions - ${JSON.stringify(definitions)}`);
    //_debug(`Passed require.js overrides - ${JSON.stringify(requireJsDefinitions)}`);

    const ternOptions = {
        async: true,
        plugins: {
            requirejs: {
                override: requireJsDefinitions
            },
        }
    };

    // If a server is already created just reset the analysis data before marking it for GC
    if (ternServer) {
        if (config.debug) {
            _debug("Reseting existing server");
        }

        ternServer.reset();
        Infer.resetGuessing();
    }

    ternServer = new Tern.Server(ternOptions);
    ternServer.addDefs(definitions);
    ternServer.addDefs(browserDefs);
    ternServer.addDefs(ecmascript);
    ternServer.addDefs(jQuery);

    files.forEach((file) => {
        ternServer.addFile(file.name, file.text);
    });
}

function _resetTernServer() {
    // If a server is already created just reset the analysis data
    if (ternServer) {
        _debug("Resetting server");
        ternServer.reset();
        Infer.resetGuessing();
        // tell the main thread we're ready to start processing again
        _emitEvent({
            type: TERN_COMMANDS.TERN_WORKER_READY
        });
    }
}

function _handleAddFiles(files) {
    _debug("Add file command handler");

    files.forEach((file) => {
        ternServer.addFile(file.name, file.text);
        _debug(`Added file ${file.name}`);
    });
}

function _handleUpdateFile(filename, text) {
    console.time("r1");
    _debug("Update file command handler");
    ternServer.addFile(filename, text);
    _debug(`Updated file ${filename}`);
    //reset to get the best hints with the updated file (to check, not working well with the current hinting)
    //ternServer.reset();
    //Infer.resetGuessing();
    console.timeEnd("r1");
}

function _handleGetType(filename, offset) {
    _debug("Get Type command handler");
    const request = _buildRequest(filename, "type", offset);

    try {
        ternServer.request(request, (error, data) => {
            if (error) {
                _debug(`Error returned from Tern 'type' request: ${error}`);
            } else {
                _debug(`Type found - ${JSON.stringify(data)}`);

                _emitEvent("ternTypeEvent", {
                    file: filename,
                    offset,
                    data
                });
            }
        });
    } catch (error) {
        console.error(`${logPrefix} ${error}`);
    }
}

function _handleGetTernHints(filename, offset) {
    _debug("Get Hints command handler");
    const request = _buildRequest(filename, "completions", offset);

    try {
        ternServer.request(request, (error, data) => {
            let completions = [];

            if (error) {
                _debug(`Error in Tern 'completions' request:  ${error}`);
            } else {
                _debug("Completions request finished correctly");

                completions = data.completions.map((completion) => {
                    return {
                        value: completion.name,
                        type: completion.type,
                        depth: completion.depth,
                        guess: completion.guess,
                        origin: completion.origin,
                        doc: completion.doc,
                        url: completion.url
                    };
                });
            }

            if (completions.length > 0) {
                _emitEvent("ternCompletionsEvent", {
                    file: filename,
                    offset,
                    completions
                });
            }
        });
    } catch (error) {
        console.error(`${logPrefix} ${error}`);
    }
}

function _buildRequest(filename, query, offset) {
    query = {
        type: query
    };

    query.file = filename;
    query.end = offset;
    query.types = true;
    query.docs = true;
    query.urls = true;
    query.caseInsensitive = false;
    query.guess = false;

    //query.start = offset;
    //query.filter = true;
    //query.sort = false;
    //query.depths = true;
    //query.origins = true;
    //query.expandWordForward = true;
    //query.lineCharPositions = true;

    const request = {
        query,
        offset
    };

    return request;
}

function _emitEvent(eventName, payload) {
    _domainManager.emitEvent(DOMAIN_NAME, eventName, [payload]);
}

function _debug(message) {
    if (config.debug) {
        console.log(`${logPrefix} ${message}`);
    }
}

exports.init = init;
