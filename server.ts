import * as builder from "botbuilder";
import * as restify from "restify";
import * as Dialogs from "./dialogs/dialogs";
import * as Intents from "./intents/intents";
import { WebAPI } from "./webAPI";
var azure = require('botbuilder-azure');

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

var tableName = "Jarvis"; // You define
var storageName = process.env.AZURE_TABLE_NAME;
var storageKey = process.env.AZURE_TABLE_KEY;

var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);

bot.set('storage', tableStorage);

// in case of infinite loops...
bot.endConversationAction("reset", "forcing dialog resetting..", { matches: /^endDialog/i });

/*** DIALOGS ***/
[new Dialogs.Commands(),
new Dialogs.Task(),
new Dialogs.UserSpeed(),
new Dialogs.RegisterActivity()].forEach((d) => d.setup(bot));


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
new Intents.UserSpeed()].forEach((intent) => intent.setup(dialog));

/*** API ***/
WebAPI.setup(server, connector, bot);
