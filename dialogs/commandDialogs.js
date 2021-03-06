"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const await_to_js_1 = require("await-to-js");
const builder = require("botbuilder");
const iteratorBaseRepository_1 = require("../domain/repositories/iteratorBaseRepository");
const result_1 = require("../domain/result");
const SecurityService_1 = require("../domain/services/SecurityService");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
class CommandDialogs {
    setup(bot) {
        bot.dialog("/profile", (session, results) => {
            session.beginDialog("/askEmail");
        });
        bot.dialog("/debug", (session) => __awaiter(this, void 0, void 0, function* () {
            session.endDialog(JSON.stringify(session.userData));
        }));
        bot.dialog("/help", (session) => __awaiter(this, void 0, void 0, function* () {
            session.sendTyping();
            if (!session.userData.user) {
                session.endDialog("Você precisa estar logado para que possa ajuda-lo");
                return;
            }
            const [err, commands] = yield await_to_js_1.default(SecurityService_1.SecurityService.getAvailableCommands(session.userData.user));
            if (err || !commands.success) {
                session.endDialog(`Ocorreu o seguinte erro ao consultar o [help]: ${(commands || err).message}`);
                return;
            }
            session.send("No momento os comandos disponíveis são: ");
            session.endDialog(commands.data);
        }));
        bot.dialog("/saveSessionAndNotify", (session, data) => __awaiter(this, void 0, void 0, function* () {
            session.userData.user = data.user;
            session.userData.login = data.login;
            const [err, msg] = yield await_to_js_1.default(SecurityService_1.SecurityService.getWelcomeMessage(data.user));
            if (err || !msg.success) {
                session.endDialog(`Ocorreu o seguinte erro ao salvar os dados do seu acesso:` +
                    `${(msg || err).message}`);
            }
            session.endDialog(msg.data);
        }));
        bot.dialog("/logOut", [
            (session, args) => {
                builder.Prompts.choice(session, "Tem certeza? Nós estávamos indo tão bem...", "Sim|Não", { listStyle: builder.ListStyle.button });
            },
            (session, results) => {
                if ("sim" === results.response.entity.toLowerCase()) {
                    session.userData = {};
                    // tslint:disable-next-line:max-line-length
                    session.endDialog("Hum... tudo bem... se quiser que eu volte a falar com você, é só chamar. Os comandos [help] ou [login] podem ajudar");
                }
                else {
                    session.endDialog("Ok! seguimos no trabalho então...");
                }
            },
        ]);
        bot.dialog("/askEmail", [
            (session, args) => {
                builder.Prompts.text(session, !args || !args.invalidEmail ?
                    "Qual seu email?"
                    : "Por favor, poderia informar um e-mail válido?");
            }, (session, results, next) => {
                let email = results.response;
                // extract the email when it comes as <a href="mailto... (skype)
                if (email.indexOf("<a") !== -1) {
                    email = email.match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];
                }
                if (SecurityService_1.SecurityService.validateEmail(email)) {
                    session.userData.email = email;
                    next();
                }
                else {
                    session.replaceDialog("/askEmail", { invalidEmail: true });
                }
            }, (session, results) => {
                this.atualizarToken(session, results);
            },
        ]);
        bot.dialog("/flipCoin", [
            (session, args) => {
                builder.Prompts.choice(session, "Escolha Cara ou Coroa.", "Cara|Coroa", { listStyle: builder.ListStyle.button });
            },
            (session, results) => {
                const flip = Math.random() > 0.5 ? "Cara" : "Coroa";
                if (flip === results.response.entity) {
                    session.endDialog("opa! saiu %s! Você venceu!", flip);
                }
                else {
                    session.endDialog("hum... %s. você perdeu! mais sorte da próxima vez. :(", flip);
                }
            },
        ]);
    }
    atualizarToken(session, results, revokeAccess = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, result] = yield await_to_js_1.default(this.createAccessToken(session, revokeAccess));
            if (result.success) {
                session.endDialog("Email de validação enviado. Por favor, autorize o acesso às minhas funções!");
                return true;
            }
            session.endDialog(`Ocorreu algum erro no token, por favor, acione o suporte: ${(result || err).message}`);
            return false;
        });
    }
    ;
    createAccessToken(session, revokeAccess) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = session.userData;
            const email = userData.email;
            const responseAdress = session.message.address;
            session.send("Criando Token de acesso...");
            session.sendTyping();
            const [errLogin, tokenResult] = yield await_to_js_1.default(SecurityService_1.SecurityService.createLoginRequest(email, responseAdress));
            if (errLogin || !tokenResult.success) {
                return result_1.Result.Fail((tokenResult || errLogin).message);
            }
            session.send(`Token criado, enviando email de liberação para ${email}...`);
            session.sendTyping();
            const [errEmail, emailResult] = yield await_to_js_1.default(SecurityService_1.SecurityService.sendLoginRequestEmail(responseAdress.channelId, email, tokenResult.data));
            if (errEmail || !emailResult.success) {
                return emailResult || result_1.Result.Fail(errEmail.message);
            }
            return result_1.Result.Ok();
        });
    }
}
exports.CommandDialogs = CommandDialogs;
//# sourceMappingURL=commandDialogs.js.map