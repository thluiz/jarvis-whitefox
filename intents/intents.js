"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const detailTaskIntents_1 = require("./detailTaskIntents");
const generalIntents_1 = require("./generalIntents");
const generateDocumentIntents_1 = require("./generateDocumentIntents");
const helpIntents_1 = require("./helpIntents");
const projectPaceIntents_1 = require("./projectPaceIntents");
const queryIntents_1 = require("./queryIntents");
const queryTaskIntents_1 = require("./queryTaskIntents");
const registerActivityIntents_1 = require("./registerActivityIntents");
const registerTaskIntents_1 = require("./registerTaskIntents");
const updateTaskIntents_1 = require("./updateTaskIntents");
const userPaceIntents_1 = require("./userPaceIntents");
// tslint:disable:max-classes-per-file
class General extends generalIntents_1.GeneralIntents {
}
exports.General = General;
class DetailTask extends detailTaskIntents_1.DetailTaskIntents {
}
exports.DetailTask = DetailTask;
class GenerateDocument extends generateDocumentIntents_1.GenerateDocumentIntents {
}
exports.GenerateDocument = GenerateDocument;
class Help extends helpIntents_1.HelpIntents {
}
exports.Help = Help;
class ProjectPace extends projectPaceIntents_1.ProjectPaceIntents {
}
exports.ProjectPace = ProjectPace;
class Query extends queryIntents_1.QueryIntents {
}
exports.Query = Query;
class QueryTask extends queryTaskIntents_1.QueryTaskIntents {
}
exports.QueryTask = QueryTask;
class RegisterActivity extends registerActivityIntents_1.RegisterActivityIntents {
}
exports.RegisterActivity = RegisterActivity;
class RegisterTask extends registerTaskIntents_1.RegisterTaskIntents {
}
exports.RegisterTask = RegisterTask;
class UpdateTask extends updateTaskIntents_1.UpdateTaskIntents {
}
exports.UpdateTask = UpdateTask;
class UserPace extends userPaceIntents_1.UserPaceIntents {
}
exports.UserPace = UserPace;
//# sourceMappingURL=intents.js.map