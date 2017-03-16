/// <reference path="../typings/index.d.ts" />
import * as builder from "botbuilder";

class IntentBuilder {
    intents: builder.IntentDialog;

    constructor() {
        this.intents = new builder.IntentDialog();
        this.addAll();
    }

    private addAll(): void {
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

        this.intents.matches(/^procurar item/i, [
            function (session) {
                session.beginDialog("/searchItembacklog");
            }
        ]);

        this.intents.matches(/^mudar projeto/i, [
            function (session) {
                session.beginDialog("/changeCurrentProject");
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
            function (session: builder.Session, args: any, next: Function) {
                if (!session.userData.user
                    || !session.userData.user.name
                    || session.userData.version) {
                    session.beginDialog("/profile");
                } else {
                    next();
                }
            },
            function (session: builder.Session, results: any) {
                if (session.userData.user && session.userData.user.name) {
                    session.send("Olá %s!", session.userData.user.name);
                } else {
                    session.send("Olá! Ainda não recebi seu token de acesso.");
                    session.send("Caso esteja com problemas vc pode tentar os comandos \"ajuda\", \"relogar\" ou \"atualizar token\"");
                }
            }
        ]);
    }

    get(): builder.IntentDialog {
        return this.intents;
    }
}


export { IntentBuilder }