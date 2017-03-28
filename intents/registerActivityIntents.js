"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const service_1 = require("../domain/services/service");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const IE = new intentEntities_1.IntentEntities();
class RegisterActivityIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("register_activity", [
            (session, args, next) => {
                if (!session.userData.user
                    || !session.userData.user.id
                    || session.userData.user.id <= 0) {
                    session.send("Antes de lançar atividades preciso ter certeza de quem é você no Iterator." +
                        "Depois que você logar poderemos criar atividades para você, ok?");
                    session.replaceDialog("/profile");
                    return;
                }
                const title = builder.EntityRecognizer.findAllEntities(args.entities, IE.Text);
                const complexity = builder.EntityRecognizer.findEntity(args.entities, IE.Complexity);
                const taskid = builder.EntityRecognizer.findEntity(args.entities, IE.EntityId);
                const taskname = builder.EntityRecognizer.findEntity(args.entities, IE.Target);
                const project = builder.EntityRecognizer.findEntity(args.entities, IE.Location);
                let activity = {
                    complexity: complexity && complexity.entity ?
                        service_1.IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    id: 0,
                    project: project ? project.entity : undefined,
                    taskId: taskid && taskid.entity ?
                        parseInt(taskid.entity, 10) : undefined,
                    taskName: taskname ? taskname.entity : undefined,
                    title: title ?
                        service_1.UtilsService.capitalizeFirstLetter(title.map((t) => {
                            return t.entity.replace("\"", "");
                        }).join(" "))
                        : undefined,
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
        ]);
    }
}
exports.RegisterActivityIntents = RegisterActivityIntents;
//# sourceMappingURL=registerActivityIntents.js.map