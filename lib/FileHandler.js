"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util_1 = require("util");
var path_1 = require("path");
var Builder_1 = require("./Builder");
var LogstashFormatter_1 = require("./LogstashFormatter");
var open = util_1.promisify(fs.open);
var write = util_1.promisify(fs.write);
var close = util_1.promisify(fs.close);
var exists = util_1.promisify(fs.exists);
var mkdir = util_1.promisify(fs.mkdir);
var HUNDRED_MEGS = 100 * 1024 * 1024;
var LOGSTASH_FORMATTER = new LogstashFormatter_1.LogstashFormatter();
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
var FileHandler = /** @class */ (function () {
    function FileHandler(prefix, rotationBytesThreshold, formatter) {
        if (rotationBytesThreshold === void 0) { rotationBytesThreshold = HUNDRED_MEGS; }
        if (formatter === void 0) { formatter = LOGSTASH_FORMATTER; }
        this.prefix = prefix;
        this.rotationBytesThreshold = rotationBytesThreshold;
        this.formatter = formatter;
        this._bytesWritten = 0;
        this._currentFile = null;
        this._currentFileSize = 0;
        this._format = this.formatter.format.bind(this.formatter);
    }
    FileHandler.builder = function () {
        return new Builder_1.Builder();
    };
    Object.defineProperty(FileHandler.prototype, "currentFile", {
        get: function () {
            return this._currentFile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileHandler.prototype, "currentFileSize", {
        get: function () {
            return this._currentFile ? this._currentFileSize : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileHandler.prototype, "bytesWritten", {
        get: function () {
            return this._bytesWritten;
        },
        enumerable: true,
        configurable: true
    });
    FileHandler.prototype.handle = function (entries) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, serializedEntries, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (entries.length === 0) {
                            return [2 /*return*/];
                        }
                        if (!(this.currentFile === null)) return [3 /*break*/, 3];
                        this._currentFile = this._createFilePath(entries[0].timestamp);
                        return [4 /*yield*/, ensureDirectoryExists(this._currentFile)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, open(this._currentFile, 'ax')];
                    case 2:
                        _a._fd = _b.sent();
                        _b.label = 3;
                    case 3:
                        serializedEntries = entries.map(this._format).join('');
                        return [4 /*yield*/, write(this._fd, serializedEntries)];
                    case 4:
                        result = _b.sent();
                        this._bytesWritten += result.bytesWritten;
                        this._currentFileSize += result.bytesWritten;
                        if (!(this._currentFileSize >= this.rotationBytesThreshold)) return [3 /*break*/, 6];
                        // New file will be created when handling next batch of entries.
                        this._currentFile = null;
                        this._currentFileSize = 0;
                        return [4 /*yield*/, close(this._fd)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileHandler.prototype._createFilePath = function (timestamp) {
        return this.prefix + "." + dateSuffix(new Date(timestamp));
    };
    return FileHandler;
}());
exports.FileHandler = FileHandler;
exports.default = FileHandler;
function ensureDirectoryExists(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = path_1.dirname(filePath);
                    return [4 /*yield*/, exists(dir)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    ensureDirectoryExists(dir);
                    return [4 /*yield*/, mkdir(dir)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function dateSuffix(date) {
    var iso = date.toISOString();
    return iso.slice(0, 10) + "_" + iso.slice(11, 23);
}
//# sourceMappingURL=FileHandler.js.map