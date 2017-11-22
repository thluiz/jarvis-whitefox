import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";
import { FunnyMessages } from "../domain/services/templates/funnyMessages";

const IE = new IntentEntities();

export class GreetingsIntents extends IntentBase {
    private SmallTalk = {
        greetings: /^(bom\ (dia|crep|domin|fi)|boa\ (tarde|noite)|saudaç)/,
        hello: /^(oi|hei|hey|e\ aí|hello|ai|aí|blz|hello|acorda|opa|hola|olá|ola)/,
        howAreYou: /^(como\ vai|blzinha|blz\?|tudo\ bem|tudo\ tranq)/,
    };

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("greetings", [
            (session, args, next) => {
                const text = builder.EntityRecognizer.findEntity(args.entities, IE.Text);
                
                if(text && text.length > 0) {
                    text = text.entity;
                    
                    if(this.SmallTalk.greetings.test(text)) {
                        session.endDialog(FunnyMessages.greetingsResponse());
                        return;
                    } 
                    
                    if (this.SmallTalk.hello.test(text)) {
                        session.endDialog(FunnyMessages.helloResponse());
                        return;
                    }
                    
                    if (this.SmallTalk.howAreYou.test(text)) {                
                        session.endDialog(FunnyMessages.howAreYouResponse());
                        return;
                    }
                }

                session.endDialog("saudações!!");
            },
        ]);
    }
}
