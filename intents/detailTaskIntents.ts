import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class DetailTaskIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("detail_task", [
            (session, args, next) => {
                session.endDialog("eu deveria buscar uma tarefa exibindo todos os detalhes" +
                                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
