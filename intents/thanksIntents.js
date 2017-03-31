"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class ThanksIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("thanks", [
            (session, args, next) => {
                session.endDialog("disponha!");
            },
        ]);
    }
}
exports.ThanksIntents = ThanksIntents;
//# sourceMappingURL=thanksIntents.js.map