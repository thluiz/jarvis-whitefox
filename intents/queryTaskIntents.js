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
const await_to_js_1 = require("await-to-js");
const builder = require("botbuilder");
const itemBacklogRepository_1 = require("../domain/repositories/itemBacklogRepository");
const service_1 = require("../domain/services/service");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const IE = new intentEntities_1.IntentEntities();
const TR = new itemBacklogRepository_1.ItembacklogRepository();
class QueryTaskIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.OptionCancel = "Deixa para lá, não quero mais procurar";
        this.TargetsRegExp = {
            activities: /^(atividade|lan(\ç|c)amento)/,
            description: /^(descri\ç)/,
            evidences: /^(evid(e|ê)ncia|anexo)/,
        };
    }
    setup(dialog) {
        dialog.matches("query_task", [
            (session, args, next) => __awaiter(this, void 0, void 0, function* () {
                if (!session.userData.user
                    || !session.userData.user.id
                    || session.userData.user.id <= 0) {
                    session.send("Antes de verificar dados das tarefas precisamos ter certeza de quem é você." +
                        "Depois que você logar poderemos verificar os dados das tarefas dos seus projetos, ok?");
                    session.replaceDialog("/profile");
                    return;
                }
                const entityId = builder.EntityRecognizer.findEntity(args.entities, IE.EntityId);
                session.dialogData.targets = builder.EntityRecognizer.findAllEntities(args.entities, IE.Target);
                session.dialogData.commands = builder.EntityRecognizer.findAllEntities(args.entities, IE.Command);
                if (entityId && entityId.entity && parseInt(entityId.entity, 10) > 0) {
                    const [errTask, task] = yield await_to_js_1.default(TR.load(parseInt(entityId.entity, 10)));
                    if (errTask || !task.success) {
                        session.send(`Ocorreu esse erro ao procurar a tarefa: ${(task || errTask).message}`);
                        return;
                    }
                    session.dialogData.task = task.data;
                    next();
                    return;
                }
                const locations = builder.EntityRecognizer.findAllEntities(args.entities, IE.Location);
                const projectOrBCs = builder.EntityRecognizer.findAllEntities(args.entities, IE.ProjectBillingCenter);
                const textEntities = builder.EntityRecognizer.findAllEntities(args.entities, IE.Text);
                const bt = service_1.UtilsService.has_billingcenter_bt(projectOrBCs);
                const poliedro = service_1.UtilsService.has_billingcenter_poliedro(projectOrBCs);
                session.dialogData.projects = service_1.UtilsService.extract_projects(projectOrBCs);
                session.dialogData.billingcenters = service_1.UtilsService.setup_billing_centers(bt, poliedro);
                session.dialogData.locations = service_1.UtilsService.setup_locations(locations);
                session.dialogData.text = textEntities ? textEntities.map((t) => { return t.entity; }).join(" ") : " ";
                if (!session.dialogData.text || session.dialogData.text.length <= 3) {
                    session.beginDialog("/getTaskTitle", { task: {} });
                    return;
                }
                next();
            }),
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                if (session.dialogData.task && session.dialogData.task.id > 0) {
                    next();
                    return;
                }
                if (results && results.response) {
                    let task = results.response.task;
                    session.dialogData.text = results.response.task.title;
                }
                session.sendTyping();
                const [err, searchResult] = yield await_to_js_1.default(service_1.IteratorService.search(session.userData.user, false, session.dialogData.projects, session.dialogData.billingcenters, session.dialogData.locations, session.dialogData.text));
                if (err || !searchResult.success) {
                    session.endDialog(`Ocorreu o seguinte erro: ${(searchResult || err).message}`);
                    return;
                }
                if (!searchResult.data || searchResult.data.length === 0) {
                    session.endDialog("Nenhum registro encontrado!");
                    return;
                }
                if (searchResult.data.length === 1 && searchResult.data[0].items.length === 1) {
                    let t = {};
                    t.id = searchResult.data[0].items[0].id;
                    t.title = searchResult.data[0].items[0].name;
                    session.dialogData.task = t;
                    next();
                    return;
                }
                session.dialogData.options = searchResult.data;
                let options = [];
                for (let d of searchResult.data) {
                    for (let i of d.items) {
                        options[options.length] = `${i.id} - ${i.name}`;
                    }
                }
                options[options.length] = this.OptionCancel;
                builder.Prompts.choice(session, "Foram encontrados vários registros, qual devo consultar?", options, { listStyle: builder.ListStyle.list });
            }),
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                if (results.response) {
                    if (results.response.entity === this.OptionCancel) {
                        session.send("Ok! depois tentamos novamente...");
                        session.clearDialogStack();
                        return;
                    }
                    const choice = results.response.entity.split(" - ");
                    let task = {};
                    task.id = parseInt(choice.shift(), 10);
                    task.title = choice.join(" - ");
                    session.dialogData.task = task;
                }
                let targets = session.dialogData.targets;
                session.sendTyping();
                if (targets && targets.length > 0) {
                    if (service_1.UtilsService.has_at_least_one(this.TargetsRegExp.description, targets)) {
                        this.getTaskDescriptions(session);
                        return;
                    }
                    if (service_1.UtilsService.has_at_least_one(this.TargetsRegExp.evidences, targets)) {
                        this.getTaskEvidences(session);
                        return;
                    }
                    if (service_1.UtilsService.has_at_least_one(this.TargetsRegExp.activities, targets)) {
                        this.getTaskActivities(session);
                        return;
                    }
                }
                this.getTaskComplexities(session);
            }),
        ]);
    }
    getTaskComplexities(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, task] = yield await_to_js_1.default(service_1.IteratorService.getTaskComplexities(session.userData.user, session.dialogData.task));
            if (err || !task.success) {
                session.endDialog(`Ocorreu o seguinte erro ao obter as complexidades: ${(err || task).message}`);
                return;
            }
            session.send(`Complexidades da tarefa *"${task.data.id} - ${task.data.title}"*: \n\n` +
                `* **Estimada:** ${task.data.complexity}; \n\n` +
                `* **Realizada:** ${task.data.complexityDone};`);
        });
    }
    getTaskEvidences(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, task] = yield await_to_js_1.default(service_1.IteratorService.getTaskEvidences(session.userData.user, session.dialogData.task));
            if (err || !task.success) {
                session.endDialog(`Ocorreu o seguinte erro ao obter os anexos: ${(err || task).message}`);
                return;
            }
            if (task.data.evidences.length === 0) {
                session.endDialog(`Nenhum anexo encontrado na tarefa *"${task.data.id} - ${task.data.title}"* `);
                return;
            }
            const evidences = task.data.evidences.map((e) => {
                return `* ${e};`;
            }).join("\n\n");
            session.send(`Anexos à tarefa *"${task.data.id} - ${task.data.title}":* \n\n` + evidences);
        });
    }
    getTaskDescriptions(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, task] = yield await_to_js_1.default(service_1.IteratorService.getTaskDescriptions(session.userData.user, session.dialogData.task));
            if (err || !task.success) {
                session.endDialog(`Ocorreu o seguinte erro ao obter as descrições: ${(err || task).message}`);
                return;
            }
            if (task.data.description.length === 0) {
                session.endDialog(`Nenhuma descrição encontrada para a tarefa *"${task.data.id} - ${task.data.title}"* `);
                return;
            }
            const descriptions = task.data.description.map((d) => {
                return `* ${d};`;
            }).join("\n\n");
            session.send(`Descrições da tarefa "${task.data.id} - ${task.data.title}": \n\n` + descriptions);
        });
    }
    getTaskActivities(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, task] = yield await_to_js_1.default(service_1.IteratorService.getTaskActivities(session.userData.user, session.dialogData.task));
            if (err || !task.success) {
                session.endDialog(`Ocorreu o seguinte erro ao obter as atividades: ${(err || task).message}`);
                return;
            }
            if (task.data.activities.length === 0) {
                session.endDialog(`Nenhuma atividade encontrada na tarefa *"${task.data.id} - ${task.data.title}"*`);
                return;
            }
            const activities = task.data.activities.map((a) => {
                return `* ${a.id} - ${a.title} *(${a.complexity} - ${a.userName})*;`;
            }).join("\n\n");
            session.send(`Atividades da tarefa *"${task.data.id} - ${task.data.title}"*: \n\n` + activities);
        });
    }
}
exports.QueryTaskIntents = QueryTaskIntents;
//# sourceMappingURL=queryTaskIntents.js.map