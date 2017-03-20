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
                const title = builder.EntityRecognizer.findEntity(args.entities, "text");
                const complexity = builder.EntityRecognizer.findEntity(args.entities, "complexity");
                const taskid = builder.EntityRecognizer.findEntity(args.entities, "entityId");
                let activity = {
                    complexity: complexity && complexity.entity ?
                        service_1.IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    id: 0,
                    taskId: taskid && taskid.entity ?
                        parseInt(taskid.entity, 10) : undefined,
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
                if (results.activity) {
                    session.dialogData.activity = results.activity;
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
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }
                let activity = session.dialogData.activity;
                session.beginDialog("/getActivityTaskId", { activity: session.dialogData.activity });
            },
            (session, results, next) => {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }
                session.beginDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
            },
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }
                const activity = session.dialogData.activity;
                const result = yield service_1.IteratorService.createActivity(session.userData.user, activity.taskId, activity.title, activity.complexity);
                if (!result.success) {
                    session.beginDialog("/confirmActivityCreation", { activity: session.dialogData.activity, errorOnSave: result.message });
                    return;
                }
                session.endDialog("Tarefa cadastrada com sucesso!");
            }),
        ]);
    }
}
exports.RegisterActivityIntents = RegisterActivityIntents;
//# sourceMappingURL=registerActivityIntents.js.map