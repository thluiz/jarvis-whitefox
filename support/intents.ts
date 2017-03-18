/// <reference path="../typings/index.d.ts" />
import * as builder from "botbuilder";

class IntentBuilder {
    intents: builder.IntentDialog;

    constructor() {
        this.intents = new builder.IntentDialog();
        this.addAll();
    }

    private addAll(): void {        
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