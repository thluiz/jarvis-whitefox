import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class LifeDoubtsIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("life_doubts", [
            (session, args, next) => {
                session.endDialog("eu deveria responder uma dúvida da sua vida," +
                    "mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
