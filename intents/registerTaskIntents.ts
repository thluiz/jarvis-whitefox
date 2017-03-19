import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class RegisterTaskIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("register_task", [
            (session, args, next) => {
                session.endDialog("eu deveria cadastrar uma tarefa, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
