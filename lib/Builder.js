"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileHandler_1 = require("./FileHandler");
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
var Builder = /** @class */ (function () {
    function Builder() {
        this._prefix = './logs/configure-me.log';
    }
    Builder.prototype.construtor = function () {
    };
    Builder.prototype.prefix = function (prefixArg) {
        this._prefix = prefixArg;
        return this;
    };
    Builder.prototype.build = function () {
        return new FileHandler_1.FileHandler(this._prefix);
    };
    return Builder;
}());
exports.Builder = Builder;
exports.default = Builder;
//# sourceMappingURL=Builder.js.map