"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folder = void 0;
var fs_1 = require("fs");
var remove = function (directory) {
    try {
        (0, fs_1.rmSync)(directory, { recursive: true, force: true });
    }
    catch (_a) {
        var message = _a.message;
        console.error(message);
        console.log("Unable to remove ".concat(directory));
    }
};
exports.folder = {
    remove: remove
};
