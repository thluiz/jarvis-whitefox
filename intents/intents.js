"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalIntents_1 = require("./generalIntents");
const generateDocumentIntents_1 = require("./generateDocumentIntents");
const helpIntents_1 = require("./helpIntents");
const registerActivityIntents_1 = require("./registerActivityIntents");
const registerTaskIntents_1 = require("./registerTaskIntents");
const searchIntents_1 = require("./searchIntents");
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
class Search extends searchIntents_1.SearchIntents {
}
exports.Search = Search;
//# sourceMappingURL=intents.js.map