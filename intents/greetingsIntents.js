"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
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
                session.endDialog("saudações!!");
            },
        ]);
    }
}
exports.GreetingsIntents = GreetingsIntents;
//# sourceMappingURL=greetingsIntents.js.map