import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class QueryTaskIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("query_task", [
            (session, args, next) => {
                session.endDialog("eu deveria buscar uma tarefa exibindo alguns detalhes" +
                                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
