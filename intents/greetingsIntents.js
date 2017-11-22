"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const funnyMessages_1 = require("../domain/services/templates/funnyMessages");
const IE = new intentEntities_1.IntentEntities();
class GreetingsIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.SmallTalk = {
            greetings: /^(bom\ (dia|crep|domin|fi)|boa\ (tarde|noite)|saudaç)/,
            hello: /^(oi|hei|hey|e\ aí|hello|ai|aí|blz|hello|acorda|opa|hola|olá|ola)/,
            howAreYou: /^(como\ vai|blzinha|blz\?|tudo\ bem|tudo\ tranq)/,
        };
    }
    setup(dialog) {
        dialog.matches("greetings", [
            (session, args, next) => {
                const text = builder.EntityRecognizer.findEntity(args.entities, IE.Text);
                if (this.SmallTalk.greetings.test(text)) {
                    session.endDialog(funnyMessages_1.FunnyMessages.greetingsResponse());
                    return;
                }
                if (this.SmallTalk.hello.test(text)) {
                    session.endDialog(funnyMessages_1.FunnyMessages.helloResponse());
                    return;
                }
                if (this.SmallTalk.howAreYou.test(text)) {
                    session.endDialog(funnyMessages_1.FunnyMessages.howAreYouResponse());
                    return;
                }
                session.endDialog("saudações!!");
            },
        ]);
    }
}
exports.GreetingsIntents = GreetingsIntents;
//# sourceMappingURL=greetingsIntents.js.map