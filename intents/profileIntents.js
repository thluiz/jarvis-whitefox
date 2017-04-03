"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const IE = new intentEntities_1.IntentEntities();
class ProfileIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.CommandList = {
            login: /^(relogar|log(ar|in))/,
            logout: /^(logout|sair)/,
        };
    }
    setup(dialog) {
        dialog.matches("profile", [
            (session, args, next) => {
                const receivedCommand = builder.EntityRecognizer.findEntity(args.entities, IE.Command);
                if (receivedCommand && receivedCommand.entity) {
                    if (this.CommandList.logout.test(receivedCommand.entity)) {
                        session.userData = {};
                        session.endDialog("ok! depois nos falamos.");
                        return;
                    }
                    if (this.CommandList.login.test(receivedCommand.entity)) {
                        session.userData = {};
                        session.beginDialog("/profile");
                        return;
                    }
                    session.endDialog(`Desculpe, ainda não posso executar o comando ${receivedCommand.entity}`);
                    return;
                }
                session.endDialog("Desculpe, não entendi :( . Em breve você poderá usar o [help]," +
                    " mas por enquanto fala com o pessoal da WhiteFox, ok?");
            },
        ]);
    }
}
exports.ProfileIntents = ProfileIntents;
//# sourceMappingURL=profileIntents.js.map