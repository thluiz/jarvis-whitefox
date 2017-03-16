/// <reference path="typings/index.d.ts" />

import * as restify from "restify";
import * as builder from "botbuilder";
import { DialogBuilder } from "./support/dialogs"
import { SecurityService } from "./domain/services/securityService";
import { UserRepository } from "./domain/repositories/userRepository";
import { DataResult } from "./support/result";
import { LoginRequest, User } from "./domain/entities";

// setup Restify Server
var server: restify.Server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});

// create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var dialogs = new DialogBuilder(connector);

server.post("/api/messages", connector.listen());

server.get("/api/security/allow/:temporaryToken", async function (req, res, next) {
    const temporaryToken: string = req.params.temporaryToken;

    const loginResult: DataResult<LoginRequest> = await SecurityService.approveAccess(temporaryToken);
    if (!loginResult.success) {
        return res.send(`Ocorreu um erro ao aprovar o acesso - Tente novamente ou acione o suporte - mensagem: ${loginResult.data}`);
    }

    const UR: UserRepository = new UserRepository();
    const userResult: DataResult<User> = await UR.load(loginResult.data.securityId);

    if (!userResult.success) {
        return res.send(`Ocorreu um erro ao obter o usuario - Tente novamente ou acione o suporte - mensagem: ${userResult.message}`);
    }

    dialogs.bot.beginDialog(loginResult.data.address, "/saveSessionAndNotify", {
        login: loginResult.data,
        user: userResult.data
    });

    if (next) {
        next();
    }

    return res.send(`Token liberado, nos falamos pelo chat!`);
});
