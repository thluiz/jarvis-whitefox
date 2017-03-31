import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class UserPaceIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("user_pace", [
            (session, args, next) => {
                session.endDialog("eu deveria mostrar o andamento de algum usuário" +
                                    ", mas ainda não me programaram... sorry :( !");
            },
        ]);
    }
}
