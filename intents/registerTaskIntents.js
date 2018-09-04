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
const intentEntities_1 = require("./intentEntities");
const IE = new intentEntities_1.IntentEntities();
class RegisterTaskIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.OptionCancel = "Pensando melhor, mais tarde cadastro essa tarefa...";
    }
    setup(dialog) {
        dialog.matches("register_task", [
            (session, args, next) => __awaiter(this, void 0, void 0, function* () {
                if (!session.userData.user
                    || !session.userData.user.id
                    || session.userData.user.id <= 0) {
                    session.send("Antes de cadastrar tarefas preciso ter certeza de quem é você no Iterator." +
                        "Depois que você logar poderemos criar tarefas para você, ok?");
                    session.replaceDialog("/profile");
                    return;
                }
                const title = builder.EntityRecognizer.findAllEntities(args.entities, IE.Text);
                const complexity = builder.EntityRecognizer.findEntity(args.entities, IE.Complexity);
                const project = builder.EntityRecognizer.findEntity(args.entities, IE.ProjectBillingCenter);
                const task = {
                    complexity: complexity && complexity.entity ?
                        service_1.IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    projectName: project ? project.entity : undefined,
                    title: title ?
                        service_1.UtilsService.capitalizeFirstLetter(title.map((t) => {
                            return t.entity.replace("\"", "");
                        }).join(" "))
                        : undefined,
                };
                session.dialogData.task = task;
                if (!task.title || task.title.length < 3) {
                    session.beginDialog("/getTaskTitle", { task });
                }
                else {
                    next();
                }
            }),
            (session, results, next) => {
                if (results && results.response) {
                    session.dialogData.task = results.response.task;
                }
                const task = session.dialogData.task;
                if (!task.complexity || task.complexity <= 0) {
                    session.beginDialog("/getTaskComplexity", { task });
                }
                else {
                    next();
                }
            },
            (session, results, next) => {
                if (results && results.response) {
                    session.dialogData.task = results.response.task;
                }
                let task = session.dialogData.task;
                if (!task.projectId || task.projectId <= 0) {
                    session.beginDialog("/getTaskProject", { task });
                }
                else {
                    next();
                }
            },
            (session, results, next) => {
                if (results.response && results.response.task) {
                    session.dialogData.task = results.response.task;
                }
                session.beginDialog("/confirmTaskCreation", { task: session.dialogData.task });
            },
        ]);
    }
}
exports.RegisterTaskIntents = RegisterTaskIntents;
//# sourceMappingURL=registerTaskIntents.js.map