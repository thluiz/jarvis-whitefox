"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intentBase_1 = require("./intentBase");
class ProfileIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.CommandList = {
            debug: /^debug/,
            flipCoin: /^(jogar\ moeda|joga\ moeda)/,
            login: /^(relogar|logar)/,
            logout: /^(logout|sair)/,
            updateBTTracking: /^atualizar acompanhamento/,
            updateIncidents: /^(atualizar\ incidentes|atualizar\ chamados)/,
        };
    }
    setup(dialog) {
        dialog.matches("profile", [
            (session, args, next) => {
                session.beginDialog("/profile");
            },
        ]);
    }
}
exports.ProfileIntents = ProfileIntents;
//# sourceMappingURL=profileIntents.js.map