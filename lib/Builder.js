"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileHandler_1 = require("./FileHandler");
var LogstashFormatter_1 = require("./LogstashFormatter");
var HUNDRED_MEGS = 100 * 1024 * 1024;
var LOGSTASH_FORMATTER = new LogstashFormatter_1.LogstashFormatter();
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
var Builder = /** @class */ (function () {
    function Builder() {
        this._prefix = './logs/configure-me.log';
        this._rotationBytesThreshold = HUNDRED_MEGS;
        this._formatter = LOGSTASH_FORMATTER;
    }
    Builder.prototype.construtor = function () {
    };
    Builder.prototype.prefix = function (prefixArg) {
        this._prefix = prefixArg;
        return this;
    };
    Builder.prototype.rotationBytesThreshold = function (thresholdArg) {
        this._rotationBytesThreshold = thresholdArg;
        return this;
    };
    Builder.prototype.formatter = function (formatterArg) {
        this._formatter = formatterArg;
        return this;
    };
    Builder.prototype.build = function () {
        return new FileHandler_1.FileHandler(this._prefix, this._formatter, this._rotationBytesThreshold);
    };
    return Builder;
}());
exports.Builder = Builder;
exports.default = Builder;
//# sourceMappingURL=Builder.js.map