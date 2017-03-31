"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class StartDemonstrationIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("start_demonstration", [
            (session, args, next) => {
                session.endDialog("eu deveria começar uma demonstração minha, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
exports.StartDemonstrationIntents = StartDemonstrationIntents;
//# sourceMappingURL=startDemonstrationIntents.js.map