import { SecurityService } from '../domain/services/securityService';
import { UtilsService } from '../domain/services/utilsService';
import * as builder from 'botbuilder';
import { IntentBuilder } from './intents'
import { Result } from './Result';

class DialogBuilder {
    bot: builder.UniversalBot;

    private async createAccessToken(session: builder.Session, revokeAccess): Promise<Result> {
        const userData = session.userData;
        const email = userData.email;
        const responseAdress = session.message.address;

        if (revokeAccess && userData.token) {
            session.send("Revogando Token anterior...");
            session.sendTyping();
            const revokeTokenResult = await SecurityService.revokeAccess(userData.token);
            if (!revokeTokenResult.success)
                return revokeTokenResult;
        }

        session.send("Criando Token de acesso...");
        session.sendTyping();
        const tokenResult = await SecurityService.createLoginRequest(email, session.message.address);
        if (!tokenResult.success)
            return tokenResult;

        session.send(`Token criado, enviando email de liberação para ${email}...`);
        session.sendTyping();

        const emailResult = await SecurityService.sendLoginRequestEmail(session.message.address.channelId, email, tokenResult.data);
        if (!emailResult.success)
            return emailResult;

        return Result.Ok()
    }

    constructor(connector) {
        var self = this;

        var atualizarToken = function (session, results, revokeAccess = false) {
            var r = self.createAccessToken(session, revokeAccess).then(function (result) {
                if (result.success) {
                    session.endDialog("Email de validação enviado. Por favor, autorize o acesso às minhas funções!");
                    return;
                }

                session.endDialog(`Ocorreu algum erro, por favor, acione o suporte: ${result.message}`);
            }).catch(function (result) {
                session.endDialog(`Ocorreu algum erro, por favor, acione o suporte: ${result.message}`);
            });
        };

        this.bot = new builder.UniversalBot(connector);
        const intentBuilder = new IntentBuilder();

        this.bot.dialog('/', intentBuilder.get());

        this.bot.dialog('/profile', [
            function (session, results) {
                session.beginDialog('/askEmail');
            }
        ]);

        this.bot.dialog('/askEmail', [
            function (session, results, next) {
                builder.Prompts.text(session, 'Qual seu email?');
            }, function (session, results, next) {
                var email = results.response;
                if(email.indexOf("<a") != -1) //extract the email when it comes as <a href='mailto...
                    email = email.match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];

                if (SecurityService.validateEmail(email)) {
                    session.userData.email = email;
                    next();
                } else {
                    session.send("Por favor, informe um e-mail válido");                    
                    session.replaceDialog('/askEmail');
                }
            }, function (session, results) {
                atualizarToken(session, results);
            }
        ]);

        this.bot.dialog('/flipCoin', [
            function (session, args) {
                builder.Prompts.choice(session, "Escolha Cara ou Coroa.", "Cara|Coroa")
            },
            function (session, results) {
                var flip = Math.random() > 0.5 ? 'Cara' : 'Coroa';
                if (flip == results.response.entity) {
                    session.endDialog("opa! saiu %s! Você venceu!", flip);
                } else {
                    session.endDialog("hum... %s. você perdeu! mais sorte da próxima vez. :(", flip);
                }
            }
        ]);

        this.bot.dialog('/generateCPF', [
            async function (session, results) {
                var cpf = await UtilsService.generateCPF();
                session.endDialog(UtilsService.funnyResultMessage('CPF', cpf), cpf);
            }
        ]);

        this.bot.dialog('/generateCNPJ', [
            async function (session, results) {
                var cnpj = await UtilsService.generateCNPJ();
                session.endDialog(UtilsService.funnyResultMessage('CNPJ', cnpj), cnpj);
            }
        ]);

        this.bot.dialog('/help', async function (session, userData) {
            session.sendTyping();
            const commands = await SecurityService.getAvailableCommands(session.userData.token);
            session.send("No momento os comandos disponíveis são: ");
            session.endDialog(commands.message);
        });

        this.bot.dialog('/notifyApprovedToken', async function (session, userData) {
            session.userData.name = userData.name;
            session.userData.token = userData.token;
            const commands = await SecurityService.getAvailableCommands(session.userData.token);

            const msg = `
Olá ${userData.name},

Acabo de receber a confirmação do seu acesso.


Ainda não possuo acesso a minha API de linguagem natural, então os comandos precisam ser executados tal qual estão descritos, ok?            


No momento os comandos disponíveis são:

${commands.message}

`;
            session.endDialog(msg);
        });
    }
}

export { DialogBuilder }