define((require, exports) => {
    "use strict";

    const DocumentManager = brackets.getModule("document/DocumentManager"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        codeEditor = require("src/editor/codeEditor"),
        constants = require("src/core/constants"),
        parser = require("src/3rdparty/@babel/parser/lib/index"),
        textTool = require("src/editor/textTool");

    function extractDefineObjects(arrayString) {
        if (arrayString) {
            arrayString = arrayString.replace(/['"\s]*/g, "");
            return arrayString.split(",");
        } else {
            return null;
        }
    }

    function getVariableScope(token, position, document = DocumentManager.getCurrentDocument()) {
        let regex = constants.regex.functionStatement,
            functionsMatches = [],
            match;
        const standardFunctionsMatches = [],
            es6FunctionsMatches = [],
            sourceCode = codeEditor.getSourceCode(document);

        do {
            match = regex.exec(sourceCode);
            if (match) {
                standardFunctionsMatches.push(match);
            }

        } while (match !== null);

        if (standardFunctionsMatches.length > 0) {
            textTool.addSubmatches(standardFunctionsMatches, sourceCode, regex);
            functionsMatches = functionsMatches.concat(standardFunctionsMatches);
        }

        regex = constants.regex.functionES6Statement;
        match = null;

        do {
            match = regex.exec(sourceCode);
            if (match) {
                es6FunctionsMatches.push(match);
            }
        } while (match !== null);

        if (es6FunctionsMatches.length > 0) {
            textTool.addSubmatches(es6FunctionsMatches, sourceCode, regex);
            functionsMatches = functionsMatches.concat(es6FunctionsMatches);
        }

        if (functionsMatches.length > 0) {
            const tokenIndex = textTool.getIndexFromPosition(sourceCode, position);
            const closest = getClosestMatch(tokenIndex, functionsMatches);

            const startPosition = {
                line: textTool.lineNumberByIndex(closest.pos, sourceCode),
                ch: 0
            };

            const endPosition = {
                line: position.line + 1,
                ch: 0
            };

            return codeEditor.getSourceCode(document, startPosition, endPosition);
        } else {
            return null;
        }
    }

    function getClosestMatch(referenceIndex, matches) {
        let foundMatch, match, submatch,
            currentDiff = 100000,
            diff;

        function process(match) {
            if (match.index) {
                diff = Math.abs(referenceIndex - match.index);
            } else {
                diff = Math.abs(referenceIndex - match.pos);
            }

            if ((diff < currentDiff)) {
                currentDiff = diff;
                foundMatch = match;
            }
        }

        for (match of matches) {
            if (Array.isArray(match)) {
                for (submatch of match) {
                    process(submatch);
                }
            } else {
                process(match);
            }
        }

        return foundMatch;
    }

    function getDefineStatementObjects(sourceCode = codeEditor.getSourceCode()) {
        /* Remove (rather simple) comments... */
        sourceCode = sourceCode.replace(constants.regex.comments, "");
        let regex = constants.regex.defineStatement;
        let defineMatch = regex.exec(sourceCode);

        if (defineMatch === null) {
            regex = constants.regex.defineES6Statement;
            defineMatch = regex.exec(sourceCode);
        }

        if (defineMatch) {
            const functionMatch = defineMatch[0].match(constants.regex.singleFunctionStatement)[1];
            const objectPaths = extractDefineObjects(defineMatch[1]);
            if (objectPaths) {
                const objectNames = extractDefineObjects(functionMatch);

                const result = {};
                for (const n in objectPaths) {
                    result[objectNames[n]] = objectPaths[n];
                }

                return result;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    function getObjectFromComment(token, position, document, variableCodeScope) {
        const tokenDeclarationRegex = new RegExp(`(var|let|const)\\s+(${token})`, "g"),
            commentObjectPattern = constants.regex.ui5ObjectInCommentPattern,
            fullSourceCode = codeEditor.getSourceCode(document);

        let ui5Path, ui5Object;

        //check the current line
        const lines = fullSourceCode.split("\n");
        let line = lines[position.line];
        let commentMatch = line.match(commentObjectPattern);

        if (commentMatch) {
            ui5Path = commentMatch[1];
        } else {
            //check the token declaration - for variables
            const declarationMatch = tokenDeclarationRegex.exec(variableCodeScope);

            if (declarationMatch) {
                const lineNumber = textTool.lineNumberByIndex(declarationMatch.index, variableCodeScope);
                line = variableCodeScope.split("\n")[lineNumber];
                commentMatch = line.match(commentObjectPattern);

                if (commentMatch) {
                    ui5Path = commentMatch[1];
                }
            }
        }

        if (ui5Path) {
            ui5Object = ui5ApiFinder.findUi5ObjectByName(ui5Path);
        }

        return ui5Object;
    }

    function isFullUi5Path(token) {
        //if we have dots or / we can assume it's full object name
        const hasSlashes = token.indexOf("/") !== -1;
        if (token.indexOf(".") !== -1 || hasSlashes) {
            if (hasSlashes) {
                token = token.replace(/\//g, ".");
            }

            if (ui5ApiFinder.findUi5ObjectByName(token)) {
                return true;
            }
        }

        return false;
    }

    function getObjectFromDefineStatement(token, sourceCode = codeEditor.getSourceCode()) {
        let ui5Object;

        const defineObjects = getDefineStatementObjects(sourceCode);
        if (defineObjects) {
            let ui5Path = defineObjects[token];
            if (ui5Path) {
                ui5Path = ui5Path.replace(new RegExp("/", "g"), ".");
                ui5Object = ui5ApiFinder.findUi5ObjectByName(ui5Path);
            }
        }

        return ui5Object;
    }

    function getObjectByConstructor(token, position, document, variableCodeScope) {
        const constructorPattern = `${token}[\\s]*=\\s*new\\s*([0-9a-zA-Z_$\\.]*)`,
            constructorRegex = new RegExp(constructorPattern, "g"),
            fullSourceCode = codeEditor.getSourceCode(document);

        let ui5Objects = [];

        const match = constructorRegex.exec(variableCodeScope);

        if (match) {
            const constructorToken = match[1];
            if (isFullUi5Path(constructorToken)) {
                ui5Objects.push(ui5ApiFinder.findUi5ObjectByName(constructorToken));
            } else {
                //try to find the full path in define
                const defineObject = getObjectFromDefineStatement(constructorToken, fullSourceCode);

                if (defineObject) {
                    ui5Objects.push(defineObject);
                } else {
                    //otherwise try to find using only the name
                    ui5Objects = ui5Objects.concat(ui5ApiFinder.findUi5ObjectByBasename(constructorToken));
                }
            }
        }

        return ui5Objects;
    }

    function resolveUi5Token(token, position, document = DocumentManager.getCurrentDocument(), returnOneObject = false) {
        let ui5Objects = [];

        const variableScopeCode = getVariableScope(token, position, document);

        //find the ui5 object declaration in the comment
        const ui5Object = getObjectFromComment(token, position, document, variableScopeCode);

        if (ui5Object) {
            ui5Objects.push(ui5Object);
            return ui5Objects;
        }

        ui5Objects = getObjectByConstructor(token, position, document, variableScopeCode);

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

        return ui5Objects;
    }

    function extractXmlNamespaces(sourceCode) {
        const namespaces = {};

        let match, prefix;
        do {
            match = constants.regex.xmlNamespace.exec(sourceCode);
            if (match) {
                if (match[1]) {
                    prefix = match[1];
                } else {
                    prefix = "root";
                }

                namespaces[prefix] = match[2];
            }
        } while (match);

        return namespaces;
    }

    exports.getClosestMatch = getClosestMatch;
    exports.getDefineStatementObjects = getDefineStatementObjects;
    exports.getObjectFromComment = getObjectFromComment;
    exports.getObjectByConstructor = getObjectByConstructor;
    exports.getObjectFromDefineStatement = getObjectFromDefineStatement;
    exports.getVariableScope = getVariableScope;
    exports.extractDefineObjects = extractDefineObjects;
    exports.resolveUi5Token = resolveUi5Token;
    exports.isFullUi5Path = isFullUi5Path;
    exports.extractXmlNamespaces = extractXmlNamespaces;
});
