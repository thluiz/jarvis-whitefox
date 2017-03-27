"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class QueryTaskIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("query_task", [
            (session, args, next) => {
                session.endDialog("eu deveria buscar uma tarefa exibindo alguns detalhes" +
                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.QueryTaskIntents = QueryTaskIntents;
//# sourceMappingURL=queryTaskIntents.js.map