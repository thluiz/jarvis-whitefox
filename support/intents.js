"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../typings/index.d.ts" />
const builder = require("botbuilder");
class IntentBuilder {
    constructor() {
        this.intents = new builder.IntentDialog();
        this.addAll();
    }
    addAll() {
        this.intents.onDefault([
            function (session, args, next) {
                if (!session.userData.user
                    || !session.userData.user.name
                    || session.userData.version) {
                    session.beginDialog("/profile");
                }
                else {
                    next();
                }
            },
            function (session, results) {
                if (session.userData.user && session.userData.user.name) {
                    session.send("Olá %s!", session.userData.user.name);
                }
                else {
                    session.send("Olá! Ainda não recebi seu token de acesso.");
                    session.send("Caso esteja com problemas vc pode tentar os comandos \"ajuda\", \"relogar\" ou \"atualizar token\"");
                }
            }
        ]);
    }
    get() {
        return this.intents;
    }
}
exports.IntentBuilder = IntentBuilder;
//# sourceMappingURL=intents.js.map