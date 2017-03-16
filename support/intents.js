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
        // var self: IntentBuilder = this;
        this.intents.matches(/^debug/i, function (session, results) {
            session.beginDialog("/debug");
        });
        this.intents.matches(/^atualizar token/i, function (session, results) {
            session.beginDialog("/profile");
        });
        this.intents.matches(/^relogar/i, [
            function (session) {
                session.userData = {};
                session.beginDialog("/profile");
            }
        ]);
        this.intents.matches(/^gerar cpf/i, [
            function (session) {
                session.beginDialog("/generateCPF");
            }
        ]);
        this.intents.matches(/^procurar tarefa/i, [
            function (session) {
                session.beginDialog("/searchItembacklog");
            }
        ]);
        this.intents.matches(/^procurar item/i, [
            function (session) {
                session.beginDialog("/searchItembacklog");
            }
        ]);
        this.intents.matches(/^lançar tarefa/i, [
            function (session) {
                session.beginDialog("/createTask");
            }
        ]);
        this.intents.matches(/^criar tarefa/i, [
            function (session) {
                session.beginDialog("/createTask");
            }
        ]);
        this.intents.matches(/^cadastrar tarefa/i, [
            function (session) {
                session.beginDialog("/createTask");
            }
        ]);
        this.intents.matches(/^gerar cnpj/i, [
            function (session) {
                session.beginDialog("/generateCNPJ");
            }
        ]);
        this.intents.matches(/^jogar moeda/i, [
            function (session) {
                session.beginDialog("/flipCoin");
            }
        ]);
        this.intents.matches(/^help/i, [
            function (session) {
                session.beginDialog("/help");
            }
        ]);
        this.intents.matches(/^ajuda/i, [
            function (session) {
                session.beginDialog("/help");
            }
        ]);
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