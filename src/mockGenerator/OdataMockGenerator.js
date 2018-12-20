define((require, exports, module) => {
    "use strict";

    const ProjectManager = brackets.getModule("project/ProjectManager"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        constants = require("src/core/constants"),
        strings = require("strings"),
        prefs = require("src/main/preferences");

    class OdataMockGenerator {
        constructor(rootUri = prefs.get(constants.prefs.MOCK_DATA_ROOT_URI), metadataUrl) {
            if (!metadataUrl) {
                metadataUrl = prefs.get(constants.prefs.METADATA_PATH);

                if (metadataUrl.indexOf("http") === -1) {
                    const projectPath = ProjectManager.getProjectRoot().fullPath;
                    metadataUrl = `${projectPath}${metadataUrl}`;
                }
            }

            if (rootUri.substr(rootUri.length - 1) !== "/") {
                rootUri = `${rootUri}/`;
            }

            this.rootUri = rootUri;
            this._loadMetadata(metadataUrl);
        }

        createMockData() {
            if (!this._oMetadata) {
                throw strings.ODATA_SERVICE_NOT_LOADED;
            }

            const path = ProjectManager.getProjectRoot().fullPath;
            const directory = FileSystem.getDirectoryForPath(`${path}${prefs.get(constants.prefs.MOCK_DATA_DIR)}`);
            directory.create();
            const mockData = this._getMockData();
            let newFile, content, filePath;

            jQuery.each(mockData, (key, value) => {
                filePath = `${directory.fullPath}${key}.json`;
                content = JSON.stringify(value);
                (function (path, fileContent) {
                    FileSystem.resolve(path, (error, file) => {
                        if (file) {
                            if (prefs.get(constants.prefs.MOCK_DATA_OVERWRITE) === true) {
                                file.moveToTrash();
                                file.write(fileContent);
                            }
                        } else {
                            newFile = FileSystem.getFileForPath(path);
                            newFile.write(fileContent);
                        }
                    });
                }(filePath, content));
            });
        }

        _getMockData() {
            const entitySets = this._findEntitySets(this._oMetadata);
            this._findEntityTypes(this._oMetadata);
            this._generateMockdata(entitySets, this._oMetadata);

            return this._oMockdata;
        }

        _loadMetadata(metadataUrl) {
            jQuery.ajax({
                url: metadataUrl,
                dataType: "text",
                async: false,
                success: (xml) => {
                    if (!xml) {
                        console.error(strings.URL_GET_ERROR, metadataUrl);
                    }
                    this._sMetadata = xml;
                    try {
                        this._oMetadata = jQuery.parseXML(xml);
                    } catch (error) {
                        console.error(strings.METADATA_ERROR, error);
                    }
                },
                error: () => {
                    console.error(strings.URL_GET_ERROR, metadataUrl);
                }
            });
        }

        _generateMockdata(mEntitySets, oMetadata) {
            const oMockData = {};
            const sRootUri = this._getRootUri();
            jQuery.each(mEntitySets, (sEntitySetName, oEntitySet) => {
                const mEntitySet = {};
                mEntitySet[oEntitySet.name] = oEntitySet;
                oMockData[sEntitySetName] = this._generateODataMockdataForEntitySet(mEntitySet, oMetadata)[sEntitySetName];
            });
            // changing the values if there is a referential constraint
            jQuery.each(mEntitySets, (sEntitySetName, oEntitySet) => {
                for (const navprop in oEntitySet.navprops) {
                    const oNavProp = oEntitySet.navprops[navprop];
                    const iPropRefLength = oNavProp.from.propRef.length;
                    for (let j = 0; j < iPropRefLength; j++) {
                        for (let i = 0; i < oMockData[sEntitySetName].length; i++) {
                            const oEntity = oMockData[sEntitySetName][i];
                            // copy the value from the principle to the dependant;
                            oMockData[oNavProp.to.entitySet][i][oNavProp.to.propRef[j]] = oEntity[oNavProp.from.propRef[j]];
                        }
                    }
                }
                jQuery.each(oMockData[sEntitySetName], (iIndex, oEntry) => {
                    // add the metadata for the entry
                    oEntry.__metadata = {
                        uri: sRootUri + sEntitySetName + "(" + this._createKeysString(oEntitySet, oEntry) + ")",
                        type: oEntitySet.schema + "." + oEntitySet.type
                    };
                    // add the navigation properties
                    jQuery.each(oEntitySet.navprops, (sKey) => {
                        oEntry[sKey] = {
                            __deferred: {
                                uri: sRootUri + sEntitySetName + "(" + this._createKeysString(oEntitySet, oEntry) + ")/" + sKey
                            }
                        };
                    });
                });
            });
            this._oMockdata = oMockData;
        }

        _generateODataMockdataForEntitySet(mEntitySets, oMetadata) {
            // load the entity sets (map the entity type data to the entity set)
            const oMockData = {};

            // here we need to analyse the EDMX and identify the entity types and complex types
            const mEntityTypes = this._findEntityTypes(oMetadata);
            const mComplexTypes = this._findComplexTypes(oMetadata);

            jQuery.each(mEntitySets, (sEntitySetName, oEntitySet) => {
                oMockData[sEntitySetName] = this._generateDataFromEntitySet(oEntitySet, mEntityTypes, mComplexTypes);
            });
            return oMockData;
        }

        _findEntityTypes(oMetadata) {
            const mEntityTypes = {};
            jQuery(oMetadata).find("EntityType").each((iIndex, oEntityType) => {
                const $EntityType = jQuery(oEntityType);
                mEntityTypes[$EntityType.attr("Name")] = {
                    "name": $EntityType.attr("Name"),
                    "properties": [],
                    "keys": []
                };
                $EntityType.find("Property").each((iIndex, oProperty) => {
                    const $Property = jQuery(oProperty);
                    const type = $Property.attr("Type");
                    mEntityTypes[$EntityType.attr("Name")].properties.push({
                        "schema": type.substring(0, type.lastIndexOf(".")),
                        "type": type.substring(type.lastIndexOf(".") + 1),
                        "name": $Property.attr("Name"),
                        "precision": $Property.attr("Precision"),
                        "scale": $Property.attr("Scale")
                    });
                });
                $EntityType.find("PropertyRef").each((iIndex, oKey) => {
                    const $Key = jQuery(oKey);
                    const sPropertyName = $Key.attr("Name");
                    mEntityTypes[$EntityType.attr("Name")].keys.push(sPropertyName);
                });
            });
            return mEntityTypes;
        }

        _findComplexTypes(oMetadata) {
            const mComplexTypes = {};
            jQuery(oMetadata).find("ComplexType").each((iIndex, oComplexType) => {
                const $ComplexType = jQuery(oComplexType);
                mComplexTypes[$ComplexType.attr("Name")] = {
                    "name": $ComplexType.attr("Name"),
                    "properties": []
                };
                $ComplexType.find("Property").each((iIndex, oProperty) => {
                    const $Property = jQuery(oProperty);
                    const type = $Property.attr("Type");
                    mComplexTypes[$ComplexType.attr("Name")].properties.push({
                        "schema": type.substring(0, type.lastIndexOf(".")),
                        "type": type.substring(type.lastIndexOf(".") + 1),
                        "name": $Property.attr("Name"),
                        "precision": $Property.attr("Precision"),
                        "scale": $Property.attr("Scale")
                    });
                });
            });
            return mComplexTypes;
        }

        _generateDataFromEntitySet(oEntitySet, mEntityTypes, mComplexTypes) {
            const oEntityType = mEntityTypes[oEntitySet.type];
            const aMockedEntries = [];
            for (let i = 0; i < prefs.get(constants.prefs.MOCK_DATA_ENTITY_SIZE); i++) {
                aMockedEntries.push(this._generateDataFromEntity(oEntityType, i + 1, mComplexTypes));
            }
            return aMockedEntries;
        }

        _generateDataFromEntity(oEntityType, iIndex, mComplexTypes) {
            const oEntity = {};
            if (!oEntityType) {
                return oEntity;
            }
            for (let i = 0; i < oEntityType.properties.length; i++) {
                const oProperty = oEntityType.properties[i];
                oEntity[oProperty.name] = this._generatePropertyValue(oProperty.name, oProperty.type, mComplexTypes, iIndex);
            }
            return oEntity;
        }

        _generatePropertyValue(sKey, sType, mComplexTypes, iIndexParameter) {
            let iIndex = iIndexParameter;
            if (!iIndex) {
                iIndex = Math.floor(this._getPseudoRandomNumber("String") * 10000) + 101;
            }
            switch (sType) {
                case "String":
                    return sKey + " " + iIndex;
                case "DateTime":
                    {
                        const date = new Date();
                        date.setFullYear(2000 + Math.floor(this._getPseudoRandomNumber("DateTime") * 20));
                        date.setDate(Math.floor(this._getPseudoRandomNumber("DateTime") * 30));
                        date.setMonth(Math.floor(this._getPseudoRandomNumber("DateTime") * 12));
                        date.setMilliseconds(0);
                        return "/Date(" + date.getTime() + ")/";
                    }
                case "Int16":
                case "Int32":
                case "Int64":
                    return Math.floor(this._getPseudoRandomNumber("Int") * 10000);
                case "Decimal":
                    return Math.floor(this._getPseudoRandomNumber("Decimal") * 1000000) / 100;
                case "Boolean":
                    return this._getPseudoRandomNumber("Boolean") < 0.5;
                case "Byte":
                    return Math.floor(this._getPseudoRandomNumber("Byte") * 10);
                case "Double":
                    return this._getPseudoRandomNumber("Double") * 10;
                case "Single":
                    return this._getPseudoRandomNumber("Single") * 1000000000;
                case "SByte":
                    return Math.floor(this._getPseudoRandomNumber("SByte") * 10);
                case "Time":
                    // ODataModel expects ISO8601 duration format
                    return "PT" + Math.floor(this._getPseudoRandomNumber("Time") * 23) + "H" + Math.floor(this._getPseudoRandomNumber("Time") * 59) + "M" + Math.floor(this._getPseudoRandomNumber("Time") * 59) + "S";
                case "Guid":
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                        const r = this._getPseudoRandomNumber("Guid") * 16 | 0,
                            v = c === "x" ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    }.bind(this));
                case "Binary":
                    {
                        const nMask = Math.floor(-2147483648 + this._getPseudoRandomNumber("Binary") * 4294967295);
                        let sMask = "";
                        /*eslint-disable */
                        for (let nFlag = 0, nShifted = nMask; nFlag < 32; nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1)
                        ;

                        /*eslint-enable*/
                        return sMask;
                    }
                case "DateTimeOffset":
                    {
                        const date = new Date();
                        date.setFullYear(2000 + Math.floor(this._getPseudoRandomNumber("DateTimeOffset") * 20));
                        date.setDate(Math.floor(this._getPseudoRandomNumber("DateTimeOffset") * 30));
                        date.setMonth(Math.floor(this._getPseudoRandomNumber("DateTimeOffset") * 12));
                        date.setMilliseconds(0);
                        return "/Date(" + date.getTime() + "+0000)/";
                    }
                default:
                    return this._generateDataFromEntity(mComplexTypes[sType], iIndex, mComplexTypes);
            }
        }

        _getPseudoRandomNumber(sType) {
            if (!this._iRandomSeed) {
                this._iRandomSeed = {};
            }
            if (!this._iRandomSeed.hasOwnProperty(sType)) {
                this._iRandomSeed[sType] = 0;
            }
            this._iRandomSeed[sType] = (this._iRandomSeed[sType] + 11) * 25214903917 % 281474976710655;
            return this._iRandomSeed[sType] / 281474976710655;
        }

        _createKeysString(oEntitySet, oEntry) {
            // creates the key string for an entity
            let sKeys = "";
            if (oEntry) {
                jQuery.each(oEntitySet.keys, (iIndex, sKey) => {
                    if (sKeys) {
                        sKeys += ",";
                    }
                    let oKeyValue = oEntry[sKey];
                    if (oEntitySet.keysType[sKey] === "Edm.String") {
                        oKeyValue = encodeURIComponent("'" + oKeyValue + "'");
                    } else if (oEntitySet.keysType[sKey] === "Edm.DateTime") {
                        oKeyValue = this._getDateTime(oKeyValue);
                        oKeyValue = encodeURIComponent(oKeyValue);
                    } else if (oEntitySet.keysType[sKey] === "Edm.Guid") {
                        oKeyValue = "guid'" + oKeyValue + "'";
                    }
                    if (oEntitySet.keys.length === 1) {
                        sKeys += oKeyValue;
                        return sKeys;
                    }
                    sKeys += sKey + "=" + oKeyValue;
                });
            }
            return sKeys;
        }

        _findEntitySets(oMetadata) {
            const mEntitySets = {};
            const oPrincipals = jQuery(oMetadata).find("Principal");
            const oDependents = jQuery(oMetadata).find("Dependent");

            jQuery(oMetadata).find("EntitySet").each((iIndex, oEntitySet) => {
                const $EntitySet = jQuery(oEntitySet);
                // split the namespace and the name of the entity type (namespace could have dots inside)
                const aEntityTypeParts = /((.*)\.)?(.*)/.exec($EntitySet.attr("EntityType"));
                mEntitySets[$EntitySet.attr("Name")] = {
                    "name": $EntitySet.attr("Name"),
                    "schema": aEntityTypeParts[2],
                    "type": aEntityTypeParts[3],
                    "keys": [],
                    "keysType": {},
                    "navprops": {}
                };
            });

            // helper function to find the entity set and property reference
            // for the given role name
            const fnResolveNavProp = function (sRole, aAssociation, aAssociationSet, bFrom) {
                const sEntitySet = jQuery(aAssociationSet).find("End[Role='" + sRole + "']").attr("EntitySet");
                const sMultiplicity = jQuery(aAssociation).find("End[Role='" + sRole + "']").attr("Multiplicity");

                const aPropRef = [];
                const aConstraint = jQuery(aAssociation).find("ReferentialConstraint > [Role='" + sRole + "']");
                if (aConstraint && aConstraint.length > 0) {
                    jQuery(aConstraint[0]).children("PropertyRef").each((iIndex, oPropRef) => {
                        aPropRef.push(jQuery(oPropRef).attr("Name"));
                    });
                } else {
                    const oPrinDeps = (bFrom) ? oPrincipals : oDependents;
                    jQuery(oPrinDeps).each((iIndex, oPrinDep) => {
                        if (sRole === (jQuery(oPrinDep).attr("Role"))) {
                            jQuery(oPrinDep).children("PropertyRef").each((iIndex, oPropRef) => {
                                aPropRef.push(jQuery(oPropRef).attr("Name"));
                            });
                            return false;
                        }
                    });
                }

                return {
                    "role": sRole,
                    "entitySet": sEntitySet,
                    "propRef": aPropRef,
                    "multiplicity": sMultiplicity
                };
            };

            // find the keys and the navigation properties of the entity types
            jQuery.each(mEntitySets, (sEntitySetName, oEntitySet) => {
                // find the keys
                const $EntityType = jQuery(oMetadata).find("EntityType[Name='" + oEntitySet.type + "']");
                const aKeys = jQuery($EntityType).find("PropertyRef");
                jQuery.each(aKeys, (iIndex, oPropRef) => {
                    const sKeyName = jQuery(oPropRef).attr("Name");
                    oEntitySet.keys.push(sKeyName);
                    oEntitySet.keysType[sKeyName] = jQuery($EntityType).find("Property[Name='" + sKeyName + "']").attr("Type");
                });
                // resolve the navigation properties
                const aNavProps = jQuery(oMetadata).find("EntityType[Name='" + oEntitySet.type + "'] NavigationProperty");
                jQuery.each(aNavProps, (iIndex, oNavProp) => {
                    const $NavProp = jQuery(oNavProp);
                    const aRelationship = $NavProp.attr("Relationship").split(".");
                    const aAssociationSet = jQuery(oMetadata).find("AssociationSet[Association = '" + aRelationship.join(".") + "']");
                    const sName = aRelationship.pop();
                    const aAssociation = jQuery(oMetadata).find("Association[Name = '" + sName + "']");
                    oEntitySet.navprops[$NavProp.attr("Name")] = {
                        "name": $NavProp.attr("Name"),
                        "from": fnResolveNavProp($NavProp.attr("FromRole"), aAssociation, aAssociationSet, true),
                        "to": fnResolveNavProp($NavProp.attr("ToRole"), aAssociation, aAssociationSet, false)
                    };
                });
            });

            return mEntitySets;
        }

        _getRootUri() {
            let sUri = this.rootUri;
            sUri = sUri && /([^?#]*)([?#].*)?/.exec(sUri)[1]; // remove URL parameters or anchors
            return sUri;
        }

        _getDateTime(sString) {
            if (!sString) {
                return;
            }

            return "datetime'" + new Date(Number(sString.replace("/Date(", "").replace(")/", ""))).toJSON().substring(0, 19) + "'";
        }
    }

    module.exports = OdataMockGenerator;
});
