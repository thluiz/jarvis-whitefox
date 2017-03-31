import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class ThanksIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("thanks", [
            (session, args, next) => {
                session.endDialog("disponha!");
            },
        ]);
    }
}
