"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class UpdateTaskIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("update_task", [
            (session, args, next) => {
                session.endDialog("eu deveria atualizar uma tarefa, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.UpdateTaskIntents = UpdateTaskIntents;
//# sourceMappingURL=updateTaskIntents.js.map