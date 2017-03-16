import { SecurityService } from "../domain/services/securityService";
import { IteratorService } from "../domain/services/iteratorService";
import { UtilsService } from "../domain/services/utilsService";
import * as builder from "botbuilder";
import { IntentBuilder } from "./intents";
import { DataResult } from "./Result";


class DialogBuilder {
    bot: builder.UniversalBot;

    private async createAccessToken(session: builder.Session, revokeAccess: boolean): Promise<DataResult<any>> {
        const userData: any = session.userData;
        const email: string = userData.email;
        const responseAdress: builder.IAddress = session.message.address;

        if (revokeAccess && userData.token) {
            session.send("Revogando Token anterior...");
            session.sendTyping();
            const revokeTokenResult: DataResult<any> = await SecurityService.revokeAccess(userData.token);
            if (!revokeTokenResult.success) {
                return revokeTokenResult;
            }
        }

        session.send("Criando Token de acesso...");
        session.sendTyping();
        const tokenResult: DataResult<string> = await SecurityService.createLoginRequest(email, responseAdress);
        if (!tokenResult.success) {
            return DataResult.Fail<any>(tokenResult.message);
        }

        session.send(`Token criado, enviando email de liberação para ${email}...`);
        session.sendTyping();

        const emailResult: DataResult<string> = await SecurityService.sendLoginRequestEmail(responseAdress.channelId,
            email, tokenResult.data);


        if (!emailResult.success) {
            return emailResult;
        }

        return DataResult.Ok();
    }

    constructor(connector) {
        var self: DialogBuilder = this;

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

        this.bot.dialog("/", intentBuilder.get());

        this.bot.dialog("/profile", [
            function (session, results) {
                session.beginDialog("/askEmail");
            }
        ]);

        this.bot.dialog("/askEmail", [
            function (session: builder.Session, results: any, next: Function) {
                builder.Prompts.text(session, "Qual seu email?");
            }, function (session: builder.Session, results: any, next: Function) {
                var email: string = results.response;

                // extract the email when it comes as <a href="mailto... (skype)
                if (email.indexOf("<a") !== -1) {
                    email = email.match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];
                }

                if (SecurityService.validateEmail(email)) {
                    session.userData.email = email;
                    next();
                } else {
                    session.send("Por favor, informe um e-mail válido");
                    session.replaceDialog("/askEmail");
                }
            }, function (session: builder.Session, results: any) {
                atualizarToken(session, results);
            }
        ]);

        this.bot.dialog("/flipCoin", [
            function (session, args) {
                builder.Prompts.choice(session, "Escolha Cara ou Coroa.", "Cara|Coroa")
            },
            function (session, results) {
                var flip: string = Math.random() > 0.5 ? "Cara" : "Coroa";
                if (flip === results.response.entity) {
                    session.endDialog("opa! saiu %s! Você venceu!", flip);
                } else {
                    session.endDialog("hum... %s. você perdeu! mais sorte da próxima vez. :(", flip);
                }
            }
        ]);

        this.bot.dialog("/generateCPF", [
            async function (session, results) {
                var cpf: string = await UtilsService.generateCPF();
                session.endDialog(UtilsService.funnyResultMessage("CPF", cpf), cpf);
            }
        ]);

        this.bot.dialog("/generateCNPJ", [
            async function (session, results) {
                var cnpj: string = await UtilsService.generateCNPJ();
                session.endDialog(UtilsService.funnyResultMessage("CNPJ", cnpj), cnpj);
            }
        ]);

        this.bot.dialog("/help", async function (session) {
            session.sendTyping();
            const commands: DataResult<string> = await SecurityService.getAvailableCommands(session.userData.user);
            session.send("No momento os comandos disponíveis são: ");
            session.endDialog(commands.data);
        });

        this.bot.dialog("/searchItembacklog", [
            function (session: builder.Session, results: any, next: Function) {
                builder.Prompts.text(session, "Poderia informar parte do nome da tarefa?");
            },
            async function (session: builder.Session, results: any) {
                const title: string = results.response;
                const maxItens: number = 5;
                const titleMinLength: number = 5;

                if (title.length > titleMinLength) {
                    session.sendTyping();
                    let result = await IteratorService.SearchItemBackLog(
                        session.userData.user, title, maxItens
                    );

                    if (!result.success) {
                        session.endDialog(`Ops! aconteceu o erro ${result.message}`);
                        return;
                    }
                    const data = result.data;
                    if (data.items.length < data.totalCount) {
                        session.send(`Hum... encontrei ${data.totalCount} registros, mas não tem problema.`);
                        session.send(`Aqui vão os ${maxItens} mais recentes:`);
                    }
                    let list: string = "";
                    data.items.forEach(el => {
                        list += (`  ${el.id} - ${el.name} \n\n`);
                    });

                    session.send(list);
                    session.endDialog();
                } else {
                    session.send(`Assim você vai me dar muito trabalho, informe ao menos ${titleMinLength} caracteres para eu procurar.`);
                    session.replaceDialog("/searchItembacklog");
                }
            }]
        );

        this.bot.dialog("/createTask", async function (session) {
            session.endDialog("create task");
        });

        this.bot.dialog("/debug", async function (session) {
            session.endDialog(JSON.stringify(session.userData));
        });

        this.bot.dialog("/saveSessionAndNotify", async function (session, data) {
            session.userData.user = data.user;
            session.userData.login = data.login;
            const msg: DataResult<string> = await SecurityService.getWelcomeMessage(data.user);
            session.endDialog(msg.data);
        });
    }
}

export { DialogBuilder }