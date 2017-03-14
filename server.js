/// <reference path="typings/index.d.ts" />
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
const restify = require("restify");
const builder = require("botbuilder");
const dialogs_1 = require("./support/dialogs");
const securityService_1 = require("./domain/services/securityService");
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var dialogs = new dialogs_1.DialogBuilder(connector);
server.post('/api/messages', connector.listen());
server.get('/api/security/allow/:temporaryToken', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const temporaryToken = req.params.temporaryToken;
        const result = yield securityService_1.SecurityService.approveAccess(temporaryToken);
        if (!result.success)
            return res.send(`Ocorreu um erro - Tente novamente ou acione o suporte - mensagem: ${result.message}`);
        const data = result.data;
        if (data.success === 0)
            return res.send(`Ocorreu um erro nos dados enviados- Tente novamente ou acione o suporte - mensagem: ${data.Message}`);
        dialogs.bot.beginDialog(JSON.parse(JSON.parse(data.Address)), '/notifyApprovedToken', { name: data.Name, token: data.Token });
        if (next)
            next();
        return res.send(`Token liberado, nos falamos pelo chat!`);
    });
});
//# sourceMappingURL=server.js.map