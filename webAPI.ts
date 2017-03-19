import * as builder from "botbuilder";
import * as restify from "restify";
import { LoginRequest, User } from "./domain/entities";
import { UserRepository } from "./domain/repositories/userRepository";
import { Result } from "./domain/result";
import { SecurityService } from "./domain/services/securityService";

export class WebAPI {
    public static setup(server: restify.Server, connector: builder.ChatConnector, bot: builder.UniversalBot) {
        return new WebAPI(server, connector, bot);
    }

    constructor(server: restify.Server, connector: builder.ChatConnector, bot: builder.UniversalBot) {
        server.post("/api/messages", connector.listen());
        server.get("/api/security/allow/:temporaryToken",
            async (request, response, next) => this.allowAccess(request, response, next, bot));
    }

    private async allowAccess(request, response, next, bot: builder.UniversalBot) {
        const temporaryToken: string = request.params.temporaryToken;

        const loginResult = await SecurityService.approveAccess(temporaryToken);
        if (!loginResult.success) {
            // tslint:disable-next-line:max-line-length
            return response.send(`Erro ao aprovar esse acesso. Tente novamente ou acione o suporte e informe a mensagem: "${loginResult.message}"`);
        }

        const UR: UserRepository = new UserRepository();
        const userResult: Result<User> = await UR.load(loginResult.data.securityId);

        if (!userResult.success) {
            // tslint:disable-next-line:max-line-length
            return response.send(`Erro ao obter o usuário. Tente novamente ou acione o suporte e informe a mensagem: "${userResult.message}"`);
        }

        bot.beginDialog(loginResult.data.address, "/saveSessionAndNotify", {
            login: loginResult.data,
            user: userResult.data,
        });

        if (next) {
            next();
        }

        return response.send(`Token liberado, nos falamos pelo chat!`);
    }
}
