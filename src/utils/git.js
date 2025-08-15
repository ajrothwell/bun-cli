"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.git = void 0;
// import { FILE_PATHS, ProductType } from '../_consts';
var _consts_1 = require("../_consts");
var node_fs_1 = require("node:fs");
var node_child_process_1 = require("node:child_process");
var chalk_1 = require("chalk");
var GIT = process.env.VITE_GIT;
var fileFrom = function (_a) {
    var branch = _a.branch, file = _a.file, filePath = _a.filePath, tmpDir = _a.tmpDir;
    var outPath = "".concat(tmpDir, "/").concat(file);
    var inPath = "".concat(filePath, "/").concat(file);
    try {
        console.log(chalk_1.default.yellowBright("Ensure your selected branch is current with origin"));
        console.log(chalk_1.default.greenBright("Running git show origin ".concat(branch, ":").concat(inPath, " > ").concat(outPath)));
        (0, node_fs_1.mkdirSync)(tmpDir, { recursive: true });
        (0, node_child_process_1.execSync)("git show ".concat(GIT, ":").concat(inPath, " > ").concat(outPath));
    }
    catch (e) {
        console.log(chalk_1.default.yellowBright('File not found or new Language file being called. Writing placeholder'));
        (0, node_fs_1.writeFileSync)(outPath, JSON.stringify({}));
    }
};
var locale = function (_a) {
    var languageFile = _a.languageFile;
    fileFrom({ branch: "".concat(GIT), file: languageFile, tmpDir: _consts_1.FILE_PATHS.TMP, filePath: _consts_1.FILE_PATHS.IMPORT });
};
exports.git = {
    show: {
        fileFrom: fileFrom,
        locale: locale
    }
};
