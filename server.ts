import * as builder from "botbuilder";
import * as restify from "restify";
import * as Dialogs from "./dialogs/dialogs";
import * as Intents from "./intents/intents";
import { WebAPI } from "./webAPI";

/*** RESTIFY ***/
const server: restify.Server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978);

/*** CHAT BOT ***/
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

const bot: builder.UniversalBot = new builder.UniversalBot(connector);
const recognizer: builder.LuisRecognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
const dialog: builder.IntentDialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", dialog);

// in case of infinite loops...
bot.endConversationAction("reset", "forcing dialog resetting..", { matches: /^\/endDialog/i });

/*** DIALOGS ***/
[new Dialogs.Commands(),
new Dialogs.RegisterActivity()].forEach((d) => d.setup(bot));

/*** INTENTS ***/
[new Intents.GenerateDocument(),
new Intents.General(),
new Intents.RegisterActivity(),
new Intents.RegisterTask(),
new Intents.Search(),
new Intents.Help()].forEach((intent) => intent.setup(dialog));

/*** API ***/
WebAPI.setup(server, connector, bot);
