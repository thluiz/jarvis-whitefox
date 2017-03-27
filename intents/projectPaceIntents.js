"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class ProjectPaceIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("project_pace", [
            (session, args, next) => {
                session.endDialog("eu deveria mostrar o andamento de algum projeto" +
                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.ProjectPaceIntents = ProjectPaceIntents;
//# sourceMappingURL=projectPaceIntents.js.map