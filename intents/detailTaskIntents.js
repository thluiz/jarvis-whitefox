"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class DetailTaskIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("detail_task", [
            (session, args, next) => {
                session.endDialog("eu deveria buscar uma tarefa exibindo todos os detalhes" +
                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.DetailTaskIntents = DetailTaskIntents;
//# sourceMappingURL=detailTaskIntents.js.map