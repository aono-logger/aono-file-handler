"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
var LogstashFormatter = /** @class */ (function () {
    function LogstashFormatter(consts) {
        if (consts === void 0) { consts = {}; }
        this.consts = consts;
    }
    LogstashFormatter.prototype.format = function (entry) {
        var _this = this;
        return '{ ' +
            ("\"timestamp\": " + entry.timestamp + ", ") +
            ("\"logger\": \"" + entry.logger + "\", ") +
            ("\"level\": " + safeJsonStringify(entry.level) + ", ") +
            ("\"message\": \"" + entry.message + "\"") +
            Object.keys(this.consts)
                .map(function (key) { return ", \"" + key + "\": " + safeJsonStringify(_this.consts[key]); })
                .join('') +
            Object.keys(entry.meta)
                .map(function (key) { return ", \"\u00BB" + key + "\": " + safeJsonStringify(entry.meta[key]); })
                .join('') +
            ' }\n';
    };
    return LogstashFormatter;
}());
exports.LogstashFormatter = LogstashFormatter;
exports.default = LogstashFormatter;
function safeJsonStringify(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch (e) {
        return "\"### Error while stringifying object of type " + typeof obj + ": " + e.message + "\"";
    }
}
//# sourceMappingURL=LogstashFormatter.js.map