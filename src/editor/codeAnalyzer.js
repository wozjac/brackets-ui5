define((require, exports) => {
    "use strict";

    const ui5ApiFinder = require("src/core/ui5ApiFinder"),
        codeEditor = require("src/editor/codeEditor"),
        constants = require("src/core/constants"),
        textTool = require("src/editor/textTool");

    function extractDefineObjects(arrayString) {
        if (arrayString) {
            arrayString = arrayString.replace(/['"\s]*/g, "");
            return arrayString.split(",");
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
        const regex = constants.regex.defineStatement;
        /* Remove (rather simple) comments... */
        sourceCode = sourceCode.replace(constants.regex.comments, "");
        const defineMatch = regex.exec(sourceCode);

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

    function getObjectFromComment(token, position, sourceCode = codeEditor.getSourceCode()) {
        const tokenDeclarationRegex = new RegExp(`(var|let|const)\\s+(${token})`, "g");
        const commentObjectPattern = constants.regex.ui5ObjectInCommentPattern;
        const tokenIndex = textTool.getIndexFromPosition(sourceCode, position);
        let ui5Path, ui5Object;

        //check the current line
        const lines = sourceCode.split("\n");
        let line = lines[position.line];
        let commentMatch = line.match(commentObjectPattern);

        if (commentMatch) {
            ui5Path = commentMatch[1];
        } else {
            //check the token declaration - for variables
            //const declarationMatch = sourceCode.match(tokenDeclarationRegex);
            const declarationMatches = [];
            let match;
            do {
                match = tokenDeclarationRegex.exec(sourceCode);
                if (match) {
                    declarationMatches.push(match);
                }
            } while (match);

            if (declarationMatches.length > 0) {
                textTool.addSubmatches(declarationMatches, sourceCode, tokenDeclarationRegex);

                let closestMatch;
                if (declarationMatches.length > 1) {
                    closestMatch = getClosestMatch(tokenIndex, declarationMatches);
                } else if (declarationMatches.length === 1) {
                    closestMatch = declarationMatches[0][2];
                }

                const lineNumber = textTool.lineNumberByIndex(closestMatch.pos, sourceCode);
                line = lines[lineNumber];
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

    function isFullPath(token) {
        //if we have dots or / we can assume it's full object name
        if (token.indexOf(".") !== -1 || token.indexOf("/") !== -1) {
            return true;
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

    function getObjectByConstructor(token, position, sourceCode = codeEditor.getSourceCode()) {
        const constructorPattern = `${token}[\\s]*=\\s*new\\s*([0-9a-zA-Z_$\\.]*)`,
            constructorRegex = new RegExp(constructorPattern, "g"),
            matches = [];

        let match;
        do {
            match = constructorRegex.exec(sourceCode);
            if (match) {
                matches.push(match);
            }
        } while (match);

        let ui5Objects = [];

        if (matches.length > 0) {
            const tokenIndex = textTool.getIndexFromPosition(sourceCode, position);

            //get the closest match
            let foundMatch,
                currentDiff = 100000;

            for (match of matches) {
                const diff = Math.abs(tokenIndex - match.index);

                if ((diff < currentDiff)) {
                    currentDiff = diff;
                    foundMatch = match;
                }
            }

            if (foundMatch) {
                const constructorToken = foundMatch[1];
                if (isFullPath(constructorToken)) {
                    ui5Objects.push(ui5ApiFinder.findUi5ObjectByName(constructorToken));
                } else {
                    //try to find the full path in define
                    const defineObject = getObjectFromDefineStatement(constructorToken, sourceCode);

                    if (defineObject) {
                        ui5Objects.push(defineObject);
                    } else {
                        //otherwise try to find using only the name
                        ui5Objects = ui5Objects.concat(ui5ApiFinder.findUi5ObjectByBasename(constructorToken));
                    }
                }
            }
        }

        return ui5Objects;
    }

    function resolveUi5Token(token, position, sourceCode = codeEditor.getSourceCode(), returnOneObject = false) {
        let ui5Objects = [],
            ui5Object;

        //find the ui5 object declaration in the comment
        ui5Object = getObjectFromComment(token, position, sourceCode);

        if (!ui5Object) {
            if (isFullPath(token)) {
                ui5Object = token;
            }
        }

        if (!ui5Object) {
            //try to resolve variable type from "new ..." statement, may return multiple objects
            ui5Objects = getObjectByConstructor(token, position, sourceCode);
        }

        //find the token in the define statement
        if (!ui5Object && ui5Objects.length === 0) {
            ui5Object = getObjectFromDefineStatement(token, sourceCode);
        }

        if (ui5Object) {
            ui5Objects.push(ui5Object);
        }

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
    exports.extractDefineObjects = extractDefineObjects;
    exports.resolveUi5Token = resolveUi5Token;
    exports.isFullPath = isFullPath;
    exports.extractXmlNamespaces = extractXmlNamespaces;
});
