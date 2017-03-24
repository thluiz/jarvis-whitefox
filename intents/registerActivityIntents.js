"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const service_1 = require("../domain/services/service");
const intentBase_1 = require("./intentBase");
class RegisterActivityIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("register_activity", [
            (session, args, next) => {
                if (!session.userData.user
                    || !session.userData.user.id
                    || session.userData.user.id <= 0) {
                    // tslint:disable-next-line:max-line-length
                    session.send("Antes de lançar tarefas preciso ter certeza de quem é você no Iterator. Depois que você logar poderemos criar tarefas para você, ok?");
                    session.replaceDialog("/profile");
                    return;
                }
                const title = builder.EntityRecognizer.findEntity(args.entities, "text");
                const complexity = builder.EntityRecognizer.findEntity(args.entities, "complexity");
                const taskid = builder.EntityRecognizer.findEntity(args.entities, "entityId");
                const taskname = builder.EntityRecognizer.findEntity(args.entities, "command_or_target");
                const project = builder.EntityRecognizer.findEntity(args.entities, "location");
                let activity = {
                    complexity: complexity && complexity.entity ?
                        service_1.IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    id: 0,
                    project: project ? project.entity : undefined,
                    taskId: taskid && taskid.entity ?
                        parseInt(taskid.entity, 10) : undefined,
                    taskName: taskname ? taskname.entity : undefined,
                    title: title ? title.entity.replace("\"", "") : undefined,
                };
                session.dialogData.activity = activity;
                if (!activity.title || activity.title.length < 3) {
                    session.beginDialog("/getActivityTitle", { activity: session.dialogData.activity });
                }
                else {
                    next();
                }
            },
            (session, results, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                let activity = session.dialogData.activity;
                if (!activity.complexity) {
                    session.beginDialog("/getActivityComplexity", { activity: session.dialogData.activity });
                }
                else {
                    next();
                }
            },
            (session, results, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                let activity = session.dialogData.activity;
                if (!activity.taskId && activity.taskName && activity.taskName.length > 0) {
                    session.beginDialog("/searchTaskForActivity", { activity: session.dialogData.activity });
                }
                else {
                    next();
                }
            },
            (session, results, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                let activity = session.dialogData.activity;
                session.beginDialog("/getActivityTaskId", { activity: session.dialogData.activity });
            },
            (session, results, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                session.beginDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
            },
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                const activity = session.dialogData.activity;
                const result = yield service_1.IteratorService.createActivity(session.userData.user, activity.taskId, activity.title, activity.complexity);
                if (!result.success) {
                    session.beginDialog("/confirmActivityCreation", { activity: session.dialogData.activity, errorOnSave: result.message });
                    return;
                }
                session.endDialog("Atividade cadastrada com sucesso!");
            }),
        ]);
    }
}
exports.RegisterActivityIntents = RegisterActivityIntents;
//# sourceMappingURL=registerActivityIntents.js.map