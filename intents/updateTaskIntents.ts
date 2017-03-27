import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class UpdateTaskIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("update_task", [
            (session, args, next) => {
                session.endDialog("eu deveria atualizar uma tarefa, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
