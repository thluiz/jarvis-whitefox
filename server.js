"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const restify = require("restify");
const Dialogs = require("./dialogs/dialogs");
const Intents = require("./intents/intents");
const webAPI_1 = require("./webAPI");
/*** RESTIFY ***/
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978);
/*** CHAT BOT ***/
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
});
const bot = new builder.UniversalBot(connector);
const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
const dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", dialog);
// in case of infinite loops...
bot.endConversationAction("reset", "forcing dialog resetting..", { matches: /^endDialog/i });
/*** DIALOGS ***/
[new Dialogs.Commands(),
    new Dialogs.RegisterActivity()].forEach((d) => d.setup(bot));
/*** INTENTS ***/
[new Intents.General(),
    new Intents.GenerateDocument(),
    new Intents.DetailTask(),
    new Intents.Help(),
    new Intents.ProjectPace(),
    new Intents.Query(),
    new Intents.QueryTask(),
    new Intents.RegisterActivity(),
    new Intents.RegisterTask(),
    new Intents.UpdateTask(),
    new Intents.UserPace()].forEach((intent) => intent.setup(dialog));
/*** API ***/
webAPI_1.WebAPI.setup(server, connector, bot);
//# sourceMappingURL=server.js.map