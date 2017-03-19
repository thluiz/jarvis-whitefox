import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class RegisterActivityIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("register_activity", [
            (session, args, next) => {
                session.endDialog("eu deveria cadastrar uma atividade, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
