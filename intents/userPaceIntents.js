"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class UserPaceIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("user_pace", [
            (session, args, next) => {
                session.endDialog("eu deveria mostrar o andamento de algum usuário" +
                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.UserPaceIntents = UserPaceIntents;
//# sourceMappingURL=userPaceIntents.js.map