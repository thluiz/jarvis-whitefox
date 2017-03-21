"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalIntents_1 = require("./generalIntents");
const generateDocumentIntents_1 = require("./generateDocumentIntents");
const helpIntents_1 = require("./helpIntents");
const queryIntents_1 = require("./queryIntents");
const registerActivityIntents_1 = require("./registerActivityIntents");
const registerTaskIntents_1 = require("./registerTaskIntents");
// tslint:disable:max-classes-per-file
class General extends generalIntents_1.GeneralIntents {
}
exports.General = General;
class GenerateDocument extends generateDocumentIntents_1.GenerateDocumentIntents {
}
exports.GenerateDocument = GenerateDocument;
class Help extends helpIntents_1.HelpIntents {
}
exports.Help = Help;
class RegisterActivity extends registerActivityIntents_1.RegisterActivityIntents {
}
exports.RegisterActivity = RegisterActivity;
class RegisterTask extends registerTaskIntents_1.RegisterTaskIntents {
}
exports.RegisterTask = RegisterTask;
class Query extends queryIntents_1.QueryIntents {
}
exports.Query = Query;
//# sourceMappingURL=intents.js.map