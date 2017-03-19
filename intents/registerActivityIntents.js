"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class RegisterActivityIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("register_activity", [
            (session, args, next) => {
                session.endDialog("eu deveria cadastrar uma atividade, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.RegisterActivityIntents = RegisterActivityIntents;
//# sourceMappingURL=registerActivityIntents.js.map