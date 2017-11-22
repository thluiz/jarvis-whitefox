"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
const funnyMessages_1 = require("../domain/services/templates/funnyMessages");
class ThanksIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("thanks", [
            (session, args, next) => {
                session.endDialog(funnyMessages_1.FunnyMessages.thankYouResponse());
            },
        ]);
    }
}
exports.ThanksIntents = ThanksIntents;
//# sourceMappingURL=thanksIntents.js.map