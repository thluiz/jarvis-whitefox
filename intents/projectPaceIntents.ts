import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class ProjectPaceIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("project_pace", [
            (session, args, next) => {
                session.endDialog("eu deveria mostrar o andamento de algum projeto" +
                                    ", mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
