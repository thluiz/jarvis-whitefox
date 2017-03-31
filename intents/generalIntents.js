"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const IE = new intentEntities_1.IntentEntities();
class GeneralIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.CommandList = {
            debug: /^debug/,
        };
    }
    setup(dialog) {
        dialog.matches("None", [
            (session, args, next) => {
                const receivedCommand = builder.EntityRecognizer.findEntity(args.entities, IE.Command);
                const receivedText = builder.EntityRecognizer.findEntity(args.entities, IE.Text);
                if (receivedCommand && receivedCommand.entity) {
                    if (this.CommandList.debug.test(receivedCommand.entity)) {
                        session.endDialog(JSON.stringify(session.userData));
                        return;
                    }
                    session.endDialog(`Desculpe, ainda não posso executar o comando ${receivedCommand.entity}`);
                    return;
                }
                session.endDialog(`Desculpe, acho que não entendi`);
            },
        ]);
    }
}
exports.GeneralIntents = GeneralIntents;
//# sourceMappingURL=generalIntents.js.map