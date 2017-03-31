import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class FlipCoinIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("flip_coin", [
            (session, args, next) => {
                session.beginDialog("/flipCoin");
            },
        ]);
    }
}
