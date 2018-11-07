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
        var date = new Date();
        date.setTime(entry.timestamp);
        var formattedDate = date.toISOString();
        var message = '{ ' +
            ("\"timestamp\": " + safeJsonStringify(formattedDate) + ", ") +
            ("\"logger\": " + safeJsonStringify(entry.logger) + ", ") +
            ("\"level\": " + safeJsonStringify(entry.level) + ", ") +
            ("\"message\": " + safeJsonStringify(entry.message)) +
            Object.keys(this.consts)
                .map(function (key) { return ", \"" + key + "\": " + safeJsonStringify(_this.consts[key]); })
                .join('') +
            Object.keys(entry.meta)
                .map(function (key) { return ", \"\u00BB" + key + "\": " + safeJsonStringify(entry.meta[key]); })
                .join('') +
            ' }\n';
        var entityEncoded = message.replace(/[\u00A0-\u9999<>\&]/gim, function (i) { return "&#" + i.charCodeAt(0) + ";"; });
        return entityEncoded;
    };
    return LogstashFormatter;
}());
exports.LogstashFormatter = LogstashFormatter;
exports.default = LogstashFormatter;
function safeJsonStringify(obj) {
    try {
        if (obj instanceof Error && obj.stack) {
            // Errors are stringified to arrays containing stack trace
            // which will render nicely in Kibana.
            return JSON.stringify(obj.stack.split('\n'));
        }
        else {
            return JSON.stringify(obj);
        }
    }
    catch (e) {
        return "[\"### Error while stringifying object of type " + typeof obj + " ###\",\"" + e.message + "\"]";
    }
}
//# sourceMappingURL=LogstashFormatter.js.map