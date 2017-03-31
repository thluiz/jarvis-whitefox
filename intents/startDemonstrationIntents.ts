import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class StartDemonstrationIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("start_demonstration", [
            (session, args, next) => {
                session.endDialog("eu deveria começar uma demonstração minha, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
