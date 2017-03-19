import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class HelpIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("help", [
            (session, args, next) => {
                // tslint:disable-next-line:max-line-length
                session.endDialog("Sei que você está precisando se suporte, mas ainda não fui programado para isso... sorry! Perturba o pessoal da White Fox, por favor.");
            },
        ]);
    }
}
