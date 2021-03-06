/* eslint-disable */
/*
 * properties
 *
 * Copyright (c) 2013 Matt Steele
 * Licensed under the MIT license.
 */
define((require, exports) => {
    'use strict';

    const FileSystem = brackets.getModule("filesystem/FileSystem"),
        ProjectManager = brackets.getModule("project/ProjectManager");

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }

    var PropertiesFile = (function () {
        function PropertiesFile() {
            _classCallCheck(this, PropertiesFile);

            this.objs = {};

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (args.length) {
                this.of.apply(this, args);
            }
        }

        _createClass(PropertiesFile, [{
            key: 'makeKeys',
            value: function makeKeys(line) {
                if (line && line.indexOf('#') !== 0) {
                    var splitIndex = line.indexOf('=');
                    var key = line.substring(0, splitIndex).trim();
                    var value = line.substring(splitIndex + 1).trim();
                    // if keys already exists ...
                    if (this.objs.hasOwnProperty(key)) {
                        // if it is already an Array
                        if (Array.isArray(this.objs[key])) {
                            // just push the new value
                            this.objs[key].push(value);
                        } else {
                            // transform the value into Array
                            var oldValue = this.objs[key];
                            this.objs[key] = [oldValue, value];
                        }
                    } else {
                        // the key does not exists
                        var escapedValue = value.replace(/"/g, '\\"') // escape "
                            .replace(/\\:/g, ':') // remove \ before :
                            .replace(/\\=/g, '='); // remove \ before =
                        this.objs[key] = unescape(JSON.parse('"' + escapedValue + '"'));
                    }
                }
            }
    }, {
            key: 'addFile',
            value: function addFile(file) {
                //var data = fs.readFileSync(file, 'utf-8');
                const me = this;

                const promise = new Promise((resolve, reject) => {
                    const localFile = FileSystem.getFileForPath(file);

                    if (localFile) {
                        localFile.read((error, data) => {
                            if (error) {
                                reject(error);
                            } else {
                                const items = data.split(/\r?\n/);

                                for (let i = 0; i < items.length; i++) {
                                    let line = items[i];
                                    while (line.substring(line.length - 1) === "\\") {
                                        line = line.slice(0, -1);
                                        const nextLine = items[i + 1];
                                        line = line + nextLine.trim();
                                        i++;
                                    }
                                    me.makeKeys(line);
                                }
                                resolve();
                            }
                        });
                    } else {
                        reject(`File ${file} could not be read`);
                    }
                });

                return promise;
            }
    }, {
            key: 'of',
            value: function of () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                for (var i = 0; i < args.length; i++) {
                    this.addFile(args[i]);
                }
            }
    }, {
            key: 'get',
            value: function get(key, defaultValue) {
                if (this.objs.hasOwnProperty(key)) {
                    if (Array.isArray(this.objs[key])) {
                        var ret = [];
                        for (var i = 0; i < this.objs[key].length; i++) {
                            ret[i] = this.interpolate(this.objs[key][i]);
                        }
                        return ret;
                    } else {
                        return typeof this.objs[key] === 'undefined' ? '' : this.interpolate(this.objs[key]);
                    }
                }
                return defaultValue;
            }
    }, {
            key: 'getLast',
            value: function getLast(key, defaultValue) {
                if (this.objs.hasOwnProperty(key)) {
                    if (Array.isArray(this.objs[key])) {
                        var lg = this.objs[key].length;
                        return this.interpolate(this.objs[key][lg - 1]);
                    } else {
                        return typeof this.objs[key] === 'undefined' ? '' : this.interpolate(this.objs[key]);
                    }
                }
                return defaultValue;
            }
    }, {
            key: 'getFirst',
            value: function getFirst(key, defaultValue) {
                if (this.objs.hasOwnProperty(key)) {
                    if (Array.isArray(this.objs[key])) {
                        return this.interpolate(this.objs[key][0]);
                    } else {
                        return typeof this.objs[key] === 'undefined' ? '' : this.interpolate(this.objs[key]);
                    }
                }
                return defaultValue;
            }
    }, {
            key: 'getInt',
            value: function getInt(key, defaultIntValue) {
                var val = this.getLast(key);
                if (!val) {
                    return defaultIntValue;
                } else {
                    return parseInt(val, 10);
                }
            }
    }, {
            key: 'getFloat',
            value: function getFloat(key, defaultFloatValue) {
                var val = this.getLast(key);
                if (!val) {
                    return defaultFloatValue;
                } else {
                    return parseFloat(val);
                }
            }
    }, {
            key: 'getBoolean',
            value: function getBoolean(key, defaultBooleanValue) {
                function parseBool(b) {
                    return !/^(false|0)$/i.test(b) && !!b;
                }

                var val = this.getLast(key);
                if (!val) {
                    return defaultBooleanValue || false;
                } else {
                    return parseBool(val);
                }
            }
    }, {
            key: 'set',
            value: function set(key, value) {
                this.objs[key] = value;
            }
    }, {
            key: 'interpolate',
            value: function interpolate(s) {
                var me = this;
                return s.replace(/\\\\/g, '\\').replace(/\$\{([A-Za-z0-9\.]*)\}/g, function (match) {
                    return me.getLast(match.substring(2, match.length - 1));
                });
            }
    }, {
            key: 'getKeys',
            value: function getKeys() {
                var keys = [];
                for (var key in this.objs) {
                    keys.push(key);
                }
                return keys;
            }
    }, {
            key: 'getMatchingKeys',
            value: function getMatchingKeys(matchstr) {
                var keys = [];
                for (var key in this.objs) {
                    if (key.search(matchstr) !== -1) {
                        keys.push(key);
                    }
                }
                return keys;
            }
    }, {
            key: 'getKeysStartingWith',
            value: function getKeysStartingWith(matchstr) {
                var keys = [];
                for (var key in this.objs) {
                    if (key.startsWith(matchstr)) {
                        keys.push(key);
                    }
                }
                return keys;
            }
    }, {
            key: 'reset',
            value: function reset() {
                this.objs = {};
            }
    }]);

        return PropertiesFile;
    })();

    // Retain 'of' from v1 for backward compatibility
    var of = function of () {
        var globalFile = new PropertiesFile();

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        globalFile.of.apply(globalFile, args);
        return globalFile;
    };

    exports.PropertiesFile = PropertiesFile;
    exports.of = of ;
});
