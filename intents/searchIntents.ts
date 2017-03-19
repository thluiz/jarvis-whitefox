import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class SearchIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("search", [
            (session, args, next) => {
                session.endDialog("eu deveria procurar alguma coisa, mas ainda não me programaram... sorry!");
            },
        ]);
    }
}
