"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class FlipCoinIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("flip_coin", [
            (session, args, next) => {
                session.beginDialog("/flipCoin");
            },
        ]);
    }
}
exports.FlipCoinIntents = FlipCoinIntents;
//# sourceMappingURL=flipCoinIntents.js.map