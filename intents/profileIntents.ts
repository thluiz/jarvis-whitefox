import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class ProfileIntents extends IntentBase {
    private CommandList = {
        login: /^(relogar|log(ar|in))/,
        logout: /^(logout|sair)/,
    };

    public setup(dialog: builder.IntentDialog): void {
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
