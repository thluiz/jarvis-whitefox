import to from "await-to-js";
import * as builder from "botbuilder";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { Result } from "../domain/result";
import { SecurityService } from "../domain/services/SecurityService";
import { IDialogBase } from "./dialogBase";

const IR: IteratorBaseRepository = new IteratorBaseRepository();

export class CommandDialogs implements IDialogBase {

    public setup(bot: builder.UniversalBot): void {

        bot.dialog("/profile", (session, results) => {
            session.beginDialog("/askEmail");
        });

        bot.dialog("/debug", async (session) => {
            session.endDialog(JSON.stringify(session.userData));
        });

        bot.dialog("/help", async (session) => {
            session.sendTyping();
            if (!session.userData.user) {
                session.endDialog("Você precisa estar logado para que possa ajuda-lo");
                return;
            }
            const [err, commands] = await to(SecurityService.getAvailableCommands(session.userData.user));

            if (err || !commands.success) {
                session.endDialog(`Ocorreu o seguinte erro ao consultar o [help]: ${commands.message || err.message}`);
                return;
            }

            session.send("No momento os comandos disponíveis são: ");
            session.endDialog(commands.data);
        });

        bot.dialog("/saveSessionAndNotify", async (session, data) => {
            session.userData.user = data.user;
            session.userData.login = data.login;
            const [err, msg] = await to(SecurityService.getWelcomeMessage(data.user));
            if (err || !msg.success) {
                session.endDialog(`Ocorreu o seguinte erro ao salvar os dados do seu acesso:` +
                `${ msg.message || err.message }`);
            }
            session.endDialog(msg.data);
        });

        bot.dialog("/logOut", [
            (session, args) => {
                builder.Prompts.choice(session, "Tem certeza? Nós estávamos indo tão bem...", "Sim|Não",
                                        { listStyle: builder.ListStyle.button });
            },
            (session, results) => {
                if ("sim" === results.response.entity.toLowerCase()) {
                    session.userData = {};
                    // tslint:disable-next-line:max-line-length
                    session.endDialog("Hum... tudo bem... se quiser que eu volte a falar com você, é só chamar. Os comandos [help] ou [login] podem ajudar");
                } else {
                    session.endDialog("Ok! seguimos no trabalho então...");
                }
            },
        ]);

        bot.dialog("/askEmail", [
            (session: builder.Session, args: any) => {
                builder.Prompts.text(session, !args || !args.invalidEmail ?
                "Qual seu email?"
                : "Por favor, poderia informar um e-mail válido?");
            }, (session: builder.Session, results: any, next: Function) => {
                let email: string = results.response;

                // extract the email when it comes as <a href="mailto... (skype)
                if (email.indexOf("<a") !== -1) {
                    email = email.match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];
                }

                if (SecurityService.validateEmail(email)) {
                    session.userData.email = email;
                    next();
                } else {
                    session.replaceDialog("/askEmail", { invalidEmail: true });
                }
            }, (session: builder.Session, results: any) => {
                this.atualizarToken(session, results);
            },
        ]);

        bot.dialog("/flipCoin", [
            (session, args) => {
                builder.Prompts.choice(session, "Escolha Cara ou Coroa.", "Cara|Coroa",
                                        { listStyle: builder.ListStyle.button });
            },
            (session, results) => {
                const flip = Math.random() > 0.5 ? "Cara" : "Coroa";
                if (flip === results.response.entity) {
                    session.endDialog("opa! saiu %s! Você venceu!", flip);
                } else {
                    session.endDialog("hum... %s. você perdeu! mais sorte da próxima vez. :(", flip);
                }
            },
        ]);
    }

    private async atualizarToken(session, results, revokeAccess = false) : boolean {
        const [err, result] = await to(this.createAccessToken(session, revokeAccess));

        if (result.success) {
            session.endDialog("Email de validação enviado. Por favor, autorize o acesso às minhas funções!");
            return true;
        }

        session.endDialog(`Ocorreu algum erro no token, por favor, acione o suporte: ${result.message || err.message}`);
        return false;
    };

    private async createAccessToken(session: builder.Session, revokeAccess: boolean): Promise<Result<any>> {
        const userData: any = session.userData;
        const email: string = userData.email;
        const responseAdress: builder.IAddress = session.message.address;

        session.send("Criando Token de acesso...");
        session.sendTyping();
        const [ errLogin, tokenResult] = await to(SecurityService.createLoginRequest(email, responseAdress));
        if (errLogin || !tokenResult.success) {
            return Result.Fail<any>(tokenResult.message || errLogin.message);
        }

        session.send(`Token criado, enviando email de liberação para ${email}...`);
        session.sendTyping();

        const [ errEmail, emailResult] = await to(SecurityService.sendLoginRequestEmail(
            responseAdress.channelId, email, tokenResult.data));

        if (errEmail || !emailResult.success) {
            return emailResult || Result.Fail(errEmail.message);
        }

        return Result.Ok();
    }
}
