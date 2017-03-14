import { SecurityService } from '../domain/services/securityService';
import * as builder from 'botbuilder';
import {Result} from './Result';

class IntentBuilder {
    intents: builder.IntentDialog;

    constructor() {
        this.intents = new builder.IntentDialog();
        this.addAll();
    }
    
    private addAll() {
        var self = this;

        this.intents.matches(/^atualizar token/i, function(session, results) {             
            session.beginDialog('/profile');
        });

        this.intents.matches(/^relogar/i, [
            function (session) {
                session.userData = {};
                session.beginDialog('/profile');
            }            
        ]);

        this.intents.matches(/^gerar cpf/i, [
            function (session) {                
                session.beginDialog('/generateCPF');
            }
        ]);

        this.intents.matches(/^gerar cnpj/i, [
            function (session) {                
                session.beginDialog('/generateCNPJ');
            }
        ]);

        this.intents.matches(/^jogar moeda/i, [
            function (session) {                
                session.beginDialog('/flipCoin');
            }
        ]);

        this.intents.matches(/^help/i, [
            function (session) {                
                session.beginDialog('/help');
            }
        ]);

        this.intents.matches(/^ajuda/i, [
            function (session) {                
                session.beginDialog('/help');
            }
        ]);

        this.intents.onDefault([
            function (session, args, next) {
                if (!session.userData.name || session.userData.version) {
                    session.beginDialog('/profile');
                } else {
                    next();
                }
            },
            function (session, results) {
                if(session.userData.name)
                    session.send('Olá %s!', session.userData.name);
                else {
                    session.send('Olá! Ainda não recebi seu token de acesso.'); 
                    session.send('Caso esteja com problemas vc pode tentar os comandos \'ajuda\', \'relogar\' ou \'atualizar token\'');
                }
            }
        ]);
    }

    get() {
        return this.intents;
    }
}


export { IntentBuilder }