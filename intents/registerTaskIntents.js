"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class RegisterTaskIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("register_task", [
            (session, args, next) => {
                session.endDialog("eu deveria cadastrar uma tarefa, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.RegisterTaskIntents = RegisterTaskIntents;
//# sourceMappingURL=registerTaskIntents.js.map