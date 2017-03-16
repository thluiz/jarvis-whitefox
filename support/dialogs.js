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
const securityService_1 = require("../domain/services/securityService");
const utilsService_1 = require("../domain/services/utilsService");
const builder = require("botbuilder");
const intents_1 = require("./intents");
const Result_1 = require("./Result");
class DialogBuilder {
    createAccessToken(session, revokeAccess) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = session.userData;
            const email = userData.email;
            const responseAdress = session.message.address;
            if (revokeAccess && userData.token) {
                session.send("Revogando Token anterior...");
                session.sendTyping();
                const revokeTokenResult = yield securityService_1.SecurityService.revokeAccess(userData.token);
                if (!revokeTokenResult.success) {
                    return revokeTokenResult;
                }
            }
            session.send("Criando Token de acesso...");
            session.sendTyping();
            const tokenResult = yield securityService_1.SecurityService.createLoginRequest(email, responseAdress);
            if (!tokenResult.success) {
                return Result_1.DataResult.Fail(tokenResult.message);
            }
            session.send(`Token criado, enviando email de liberação para ${email}...`);
            session.sendTyping();
            const emailResult = yield securityService_1.SecurityService.sendLoginRequestEmail(responseAdress.channelId, email, tokenResult.data);
            if (!emailResult.success) {
                return emailResult;
            }
            return Result_1.DataResult.Ok();
        });
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
        const intentBuilder = new intents_1.IntentBuilder();
        this.bot.dialog("/", intentBuilder.get());
        this.bot.dialog("/profile", [
            function (session, results) {
                session.beginDialog("/askEmail");
            }
        ]);
        this.bot.dialog("/askEmail", [
            function (session, results, next) {
                builder.Prompts.text(session, "Qual seu email?");
            }, function (session, results, next) {
                var email = results.response;
                // extract the email when it comes as <a href="mailto... (skype)
                if (email.indexOf("<a") !== -1) {
                    email = email.match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];
                }
                if (securityService_1.SecurityService.validateEmail(email)) {
                    session.userData.email = email;
                    next();
                }
                else {
                    session.send("Por favor, informe um e-mail válido");
                    session.replaceDialog("/askEmail");
                }
            }, function (session, results) {
                atualizarToken(session, results);
            }
        ]);
        this.bot.dialog("/flipCoin", [
            function (session, args) {
                builder.Prompts.choice(session, "Escolha Cara ou Coroa.", "Cara|Coroa");
            },
            function (session, results) {
                var flip = Math.random() > 0.5 ? "Cara" : "Coroa";
                if (flip === results.response.entity) {
                    session.endDialog("opa! saiu %s! Você venceu!", flip);
                }
                else {
                    session.endDialog("hum... %s. você perdeu! mais sorte da próxima vez. :(", flip);
                }
            }
        ]);
        this.bot.dialog("/generateCPF", [
            function (session, results) {
                return __awaiter(this, void 0, void 0, function* () {
                    var cpf = yield utilsService_1.UtilsService.generateCPF();
                    session.endDialog(utilsService_1.UtilsService.funnyResultMessage("CPF", cpf), cpf);
                });
            }
        ]);
        this.bot.dialog("/generateCNPJ", [
            function (session, results) {
                return __awaiter(this, void 0, void 0, function* () {
                    var cnpj = yield utilsService_1.UtilsService.generateCNPJ();
                    session.endDialog(utilsService_1.UtilsService.funnyResultMessage("CNPJ", cnpj), cnpj);
                });
            }
        ]);
        this.bot.dialog("/help", function (session) {
            return __awaiter(this, void 0, void 0, function* () {
                session.sendTyping();
                const commands = yield securityService_1.SecurityService.getAvailableCommands(session.userData.user);
                session.send("No momento os comandos disponíveis são: ");
                session.endDialog(commands.data);
            });
        });
        this.bot.dialog("/searchItembacklog", function (session) {
            return __awaiter(this, void 0, void 0, function* () {
                session.endDialog("search");
            });
        });
        this.bot.dialog("/createTask", function (session) {
            return __awaiter(this, void 0, void 0, function* () {
                session.endDialog("create task");
            });
        });
        this.bot.dialog("/debug", function (session) {
            return __awaiter(this, void 0, void 0, function* () {
                session.endDialog(JSON.stringify(session.userData));
            });
        });
        this.bot.dialog("/saveSessionAndNotify", function (session, data) {
            return __awaiter(this, void 0, void 0, function* () {
                session.userData.user = data.user;
                session.userData.login = data.login;
                const msg = yield securityService_1.SecurityService.getWelcomeMessage(data.user);
                session.endDialog(msg.data);
            });
        });
    }
}
exports.DialogBuilder = DialogBuilder;
//# sourceMappingURL=dialogs.js.map