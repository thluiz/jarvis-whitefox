import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class GreetingsIntents extends IntentBase {
    private SmallTalk = {
        greetings: /^(bom\ (dia|crep|domin|fi)|boa\ (tarde|noite)|saudaç)/,
        hello: /^(oi|hei|hey|e\ aí|hello|ai|aí|blz|hello|acorda|opa|hola|olá|ola)/,
        howAreYou: /^(como\ vai|blzinha|blz\?|tudo\ bem|tudo\ tranq)/,
    };

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("greetings", [
            (session, args, next) => {
                session.endDialog("saudações!!");
            },
        ]);
    }
}
