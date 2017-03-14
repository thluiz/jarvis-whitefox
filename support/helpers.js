"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    static generateRandomString(length = 13) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map