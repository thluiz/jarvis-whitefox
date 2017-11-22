import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";
import { FunnyMessages } from "../domain/services/templates/funnyMessages";

export class ThanksIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("thanks", [
            (session, args, next) => {                
                session.endDialog(FunnyMessages.thankYouResponse());
            },
        ]);
    }
}
