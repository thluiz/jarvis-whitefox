import * as builder from "botbuilder";
import { IntentBase } from "./intentBase";

export class ProfileIntents extends IntentBase {
    private CommandList = {
        debug: /^debug/,
        flipCoin: /^(jogar\ moeda|joga\ moeda)/,
        login: /^(relogar|logar)/,
        logout: /^(logout|sair)/,
        updateBTTracking: /^atualizar acompanhamento/,
        updateIncidents: /^(atualizar\ incidentes|atualizar\ chamados)/,
    };

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("profile", [
            (session, args, next) => {
                session.beginDialog("/profile");
            },
        ]);
    }
}
