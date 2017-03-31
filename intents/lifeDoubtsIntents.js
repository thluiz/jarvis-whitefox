"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class LifeDoubtsIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("life_doubts", [
            (session, args, next) => {
                session.endDialog("eu deveria responder uma dúvida da sua vida," +
                    "mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.LifeDoubtsIntents = LifeDoubtsIntents;
//# sourceMappingURL=lifeDoubtsIntents.js.map