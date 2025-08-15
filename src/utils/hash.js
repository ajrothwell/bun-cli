"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.compare = void 0;
var murmurhash_1 = require("murmurhash");
var compare = function (_a) {
    var source = _a.source, target = _a.target, predicate = _a.predicate;
    return Object.entries(source).reduce(function (acc, _a) {
        var sourceKey = _a[0];
        var sourceHash = murmurhash_1.default.v3(source[sourceKey] || '');
        var targetHash = murmurhash_1.default.v3(target[sourceKey] || '');
        if (predicate(sourceHash, targetHash)) {
            acc.push({ keyName: sourceKey });
        }
        return acc;
    }, []);
};
exports.compare = compare;
exports.hash = {
    compare: exports.compare
};
