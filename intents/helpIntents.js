"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class HelpIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("help", [
            (session, args, next) => {
                // tslint:disable-next-line:max-line-length
                session.endDialog("Sei que você está precisando se suporte, mas ainda não fui programado para isso... sorry! Perturba o pessoal da White Fox, por favor.");
            },
        ]);
    }
}
exports.HelpIntents = HelpIntents;
//# sourceMappingURL=helpIntents.js.map