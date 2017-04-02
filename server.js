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
    new Dialogs.CommonTaskActions(),
    new Dialogs.UserSpeed(),
    new Dialogs.RegisterActivity(),
    new Dialogs.RegisterTask()].forEach((d) => d.setup(bot));
/*** INTENTS ***/
[
    new Intents.FlipCoin(),
    new Intents.General(),
    new Intents.GenerateDocument(),
    new Intents.Gretings(),
    new Intents.Help(),
    new Intents.LifeDouts(),
    new Intents.Profile(),
    new Intents.ProjectPace(),
    new Intents.Query(),
    new Intents.QueryTask(),
    new Intents.RegisterActivity(),
    new Intents.RegisterTask(),
    new Intents.StartDemonstration(),
    new Intents.Thanks(),
    new Intents.UpdateFollowup(),
    new Intents.UpdateIncidents(),
    new Intents.UpdateTask(),
    new Intents.UserSpeed()
].forEach((intent) => intent.setup(dialog));
/*** API ***/
webAPI_1.WebAPI.setup(server, connector, bot);
//# sourceMappingURL=server.js.map