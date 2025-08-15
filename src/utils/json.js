"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locale = exports.flatKeys = exports.keyConcat = void 0;
var assert_1 = require("assert");
var fs_1 = require("fs");
var node_path_1 = require("node:path");
var keyConcat = function (acc, _a) {
    var _b;
    var parentKey = _a[0], value = _a[1];
    if (typeof value === 'string') {
        (_b = acc[parentKey]) !== null && _b !== void 0 ? _b : (acc[parentKey] = value);
        return acc;
    }
    Object.entries(value).forEach(function (_a) {
        var childKey = _a[0], childValue = _a[1];
        return (0, exports.keyConcat)(acc, ["".concat(parentKey, "|").concat(childKey), childValue]);
    });
    return acc;
};
exports.keyConcat = keyConcat;
var flatKeys = function (file, acc) {
    if (acc === void 0) { acc = {}; }
    return Object.entries(file)
        .reduce(exports.keyConcat, acc);
};
exports.flatKeys = flatKeys;
;
var loadFlat = function (_a) {
    var directory = _a.directory, fileName = _a.fileName;
    var filePath = (0, node_path_1.join)(directory, fileName);
    (0, assert_1.default)((0, fs_1.existsSync)(filePath), "Invalid Path: ".concat((0, node_path_1.resolve)(filePath)));
    var text = (0, fs_1.readFileSync)(filePath, { encoding: 'utf-8' });
    var parsed = JSON.parse(text);
    // console.log('parsed:', parsed);
    return (0, exports.flatKeys)(parsed);
};
var list = function (directory) {
    return (0, fs_1.readdirSync)((0, node_path_1.normalize)(directory)).filter(function (file) { return file !== 'en.json' && file.includes('.js'); });
};
exports.locale = {
    json: {
        loadFlat: loadFlat,
        list: list
    }
};
