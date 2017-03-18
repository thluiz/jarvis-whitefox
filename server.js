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
const builder = require("botbuilder");
const restify = require("restify");
const Dialogs = require("./dialogs/dialogs");
const userRepository_1 = require("./domain/repositories/userRepository");
const securityService_1 = require("./domain/services/securityService");
const Intents = require("./intents/intents");
/*** RESTIFY ***/
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log("%s listening to %s", server.name, server.url);
});
/*** CHAT BOT ***/
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);
const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
const dialog = new builder.IntentDialog({ recognizers: [recognizer] });
/*** DIALOGS ***/
[new Dialogs.Commands()].forEach((d) => d.setup(bot));
/*** INTENTS ***/
[new Intents.GenerateDocument(),
    new Intents.Commands()].forEach((intent) => intent.setup(dialog));
bot.dialog("/", dialog);
/*** API ***/
server.post("/api/messages", connector.listen());
server.get("/api/security/allow/:temporaryToken", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    const temporaryToken = request.params.temporaryToken;
    const loginResult = yield securityService_1.SecurityService.approveAccess(temporaryToken);
    if (!loginResult.success) {
        response.send("Ocorreu um erro ao aprovar o acesso");
        return response.send(`Tente novamente ou acione o suporte - mensagem: ${loginResult.data}`);
    }
    const UR = new userRepository_1.UserRepository();
    const userResult = yield UR.load(loginResult.data.securityId);
    if (!userResult.success) {
        response.send("Ocorreu um erro ao obter o usuario");
        return response.send(`Tente novamente ou acione o suporte - mensagem: ${userResult.message}`);
    }
    bot.beginDialog(loginResult.data.address, "/saveSessionAndNotify", {
        login: loginResult.data,
        user: userResult.data,
    });
    if (next) {
        next();
    }
    return response.send(`Token liberado, nos falamos pelo chat!`);
}));
//# sourceMappingURL=server.js.map