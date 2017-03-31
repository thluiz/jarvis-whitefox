import to from "await-to-js";
import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class GeneralIntents extends IntentBase {

    private CommandList = {
        debug: /^debug/,

    };

    public setup(dialog: builder.IntentDialog): void {
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
