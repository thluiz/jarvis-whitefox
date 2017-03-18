import * as builder from "botbuilder";
import * as restify from "restify";
import * as Dialogs from "./dialogs/dialogs";
import { LoginRequest, User } from "./domain/entities";
import { UserRepository } from "./domain/repositories/userRepository";
import { SecurityService } from "./domain/services/securityService";
import * as Intents from "./intents/intents";
import { Result } from "./support/result";

/*** RESTIFY ***/
const server: restify.Server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log("%s listening to %s", server.name, server.url);
});

/*** CHAT BOT ***/
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot: builder.UniversalBot = new builder.UniversalBot(connector);
const recognizer: builder.LuisRecognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
const dialog: builder.IntentDialog = new builder.IntentDialog({ recognizers: [recognizer] });


/*** DIALOGS ***/
[new Dialogs.Commands()].forEach((d) => d.setup(bot));


/*** INTENTS ***/
[new Intents.GenerateDocument(),
new Intents.Commands()].forEach((intent) => intent.setup(dialog));

bot.dialog("/", dialog);

/*** API ***/
server.post("/api/messages", connector.listen());

server.get("/api/security/allow/:temporaryToken", async (request, response, next) => {
    const temporaryToken: string = request.params.temporaryToken;

    const loginResult = await SecurityService.approveAccess(temporaryToken);
    if (!loginResult.success) {
        response.send("Ocorreu um erro ao aprovar o acesso");
        return response.send(`Tente novamente ou acione o suporte - mensagem: ${loginResult.data}`);
    }

    const UR: UserRepository = new UserRepository();
    const userResult: Result<User> = await UR.load(loginResult.data.securityId);

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
});
