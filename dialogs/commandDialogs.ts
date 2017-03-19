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
            const commands: Result<string> = await SecurityService.getAvailableCommands(session.userData.user);
            session.send("No momento os comandos disponíveis são: ");
            session.endDialog(commands.data);
        });

        bot.dialog("/saveSessionAndNotify", async (session, data) => {
            session.userData.user = data.user;
            session.userData.login = data.login;
            const msg: Result<string> = await SecurityService.getWelcomeMessage(data.user);
            session.endDialog(msg.data);
        });

        bot.dialog("/askEmail", [
            (session: builder.Session, args: any, next: Function) => {
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
                const flip: string = Math.random() > 0.5 ? "Cara" : "Coroa";
                if (flip === results.response.entity) {
                    session.endDialog("opa! saiu %s! Você venceu!", flip);
                } else {
                    session.endDialog("hum... %s. você perdeu! mais sorte da próxima vez. :(", flip);
                }
            },
        ]);
    }

    private async atualizarToken(session, results, revokeAccess = false) {
        const result = await this.createAccessToken(session, revokeAccess);

        if (result.success) {
            session.endDialog("Email de validação enviado. Por favor, autorize o acesso às minhas funções!");
            return;
        }

        session.endDialog(`Ocorreu algum erro no token, por favor, acione o suporte: ${result.message}`);
    };

    private async createAccessToken(session: builder.Session, revokeAccess: boolean): Promise<Result<any>> {
        const userData: any = session.userData;
        const email: string = userData.email;
        const responseAdress: builder.IAddress = session.message.address;

        session.send("Criando Token de acesso...");
        session.sendTyping();
        const tokenResult = await SecurityService.createLoginRequest(email, responseAdress);
        if (!tokenResult.success) {
            return Result.Fail<any>(tokenResult.message);
        }

        session.send(`Token criado, enviando email de liberação para ${email}...`);
        session.sendTyping();

        const emailResult = await SecurityService.sendLoginRequestEmail(
            responseAdress.channelId, email, tokenResult.data);

        if (!emailResult.success) {
            return emailResult;
        }

        return Result.Ok();
    }
}
