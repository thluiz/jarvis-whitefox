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
const iteratorBaseRepository_1 = require("../domain/repositories/iteratorBaseRepository");
const iteratorService_1 = require("../domain/services/iteratorService");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
const IS = new iteratorService_1.IteratorService();
class TaskDialogs {
    constructor() {
        this.OptionOk = "Sim";
        this.OptionTryAgain = "Tentar novamente";
        this.OptionChange = "Alterar";
        this.OptionChangeTitle = "Título";
        this.OptionChangeComplexity = "Complexidade";
        this.OptionChangeProject = "Projeto";
        this.OptionChangeArea = "Área";
        this.OptionChangeDescription = "Descrição";
        this.OptionCancel = "Cancelar";
        this.confirmationOptions = [
            this.OptionOk,
            this.OptionChange,
            this.OptionCancel,
        ];
        this.changeOptions = [
            this.OptionChangeTitle,
            this.OptionChangeComplexity,
            this.OptionChangeProject,
            this.OptionChangeArea,
            this.OptionChangeDescription,
            this.OptionCancel,
        ];
    }
    setup(bot) {
        bot.dialog("/getTaskTitle", [(session, args) => {
                if (args.task) {
                    session.dialogData.task = args.task;
                }
                if (session.dialogData.task.title && session.dialogData.task.title.length >= 3) {
                    return;
                }
                else {
                    builder.Prompts.text(session, !args.retry ?
                        "Por favor, poderia informar o título da tarefa?"
                        : "Informe ao menos 3 caracteres para o título da tarefa: ");
                }
            }, (session, results) => {
                if (results.response && results.response.length <= 3) {
                    session.replaceDialog("/getTaskTitle", { task: session.dialogData.task, retry: true });
                    return;
                }
                session.dialogData.task.title = results.response;
                session.endDialogWithResult({ response: { task: session.dialogData.task } });
            }]);
        bot.dialog("/getTaskDescription", [(session, args) => {
                if (args.task) {
                    session.dialogData.task = args.task;
                }
                builder.Prompts.text(session, "Por favor, poderia informar então a descrição da tarefa ?\n\n" +
                    "Se não quiser adicionar, pode colocar \"0\" que ignoramos esse passo.");
            }, (session, results) => {
                let description = results.response;
                if (results.response && parseInt(results.response, 10) === 0) {
                    description = "";
                }
                session.dialogData.task.description = [description];
                session.endDialogWithResult({ response: { task: session.dialogData.task } });
            }]);
        bot.dialog("/getTaskArea", [(session, args) => __awaiter(this, void 0, void 0, function* () {
                if (args.task) {
                    session.dialogData.task = args.task;
                }
                session.sendTyping();
                let [err, areas] = yield await_to_js_1.default(iteratorService_1.IteratorService.getProjectAreas({
                    id: session.dialogData.task.projectId,
                    name: session.dialogData.task.projectName,
                }));
                if (err || !areas.success) {
                    session.endConversation(`Ocorreu um erro ao obter as áreas: ${(err || areas).message}`);
                    return;
                }
                if (!areas.data && areas.data.length === 0) {
                    session.endDialog("Não foi encontrada nenhuma área.");
                    return;
                }
                session.dialogData.areas = areas.data;
                const options = session.dialogData.areas.map((p) => { return p.name; });
                options[options.length] = this.OptionCancel;
                builder.Prompts.choice(session, "Escolha a área: ", options, { listStyle: builder.ListStyle.list });
            }), (session, results) => {
                if (results.response && results.response.entity === this.OptionCancel) {
                    session.endConversation("Ok, depois você cadastra essa tarefa");
                    return;
                }
                let areaId = 0;
                let areaName = "";
                session.dialogData.areas.forEach((a) => {
                    if (a.name.toLocaleLowerCase() === results.response.entity.toLocaleLowerCase()) {
                        areaId = a.id;
                        areaName = a.name;
                    }
                });
                session.dialogData.task.areaId = areaId;
                session.dialogData.task.areaName = areaName;
                session.endDialogWithResult({ response: { task: session.dialogData.task } });
            }]);
        bot.dialog("/getTaskComplexity", [(session, args) => {
                if (!args.task) {
                    session.endDialog("Deveria ter enviado a tarefa para alteração");
                    return;
                }
                session.dialogData.task = args.task;
                if (session.dialogData.task.complexity && session.dialogData.task.complexity > 0) {
                    return;
                }
                else {
                    builder.Prompts.text(session, !args.retry ?
                        "Por favor, poderia informar a complexidade da tarefa?"
                        : "Não entendi, a complexidade precisa ser meio(a), 0.5, 1, 2, 3, 5, 8... Poderia informar? ");
                }
            }, (session, results, next) => {
                if (results.response) {
                    const complexity = iteratorService_1.IteratorService.convertComplexity2Number(results.response);
                    if (complexity <= 0) {
                        session.replaceDialog("/getTaskComplexity", { task: session.dialogData.task, retry: true });
                        return;
                    }
                    session.dialogData.task.complexity = complexity;
                }
                session.endDialogWithResult({ response: { task: session.dialogData.task } });
            }]);
        bot.dialog("/getTaskProject", [(session, args, next) => __awaiter(this, void 0, void 0, function* () {
                if (args && args.task) {
                    session.dialogData.task = args.task;
                }
                if (args && args.projects) {
                    session.dialogData.projects = args.projects;
                }
                if (!session.dialogData.projects) {
                    session.sendTyping();
                    const [err, projects] = yield await_to_js_1.default(iteratorService_1.IteratorService.getUsersProjects(session.userData.user));
                    if (err || !projects.success) {
                        session.endDialog(`Ocorreu um erro ao obter os projetos do usuário: ${(err || projects).message}`);
                        return;
                    }
                    if (projects.data.length === 0) {
                        session.endDialog("Você não está associado a nenhum projeto," +
                            "logo não tem como registrar tarefas");
                        return;
                    }
                    if (session.dialogData.task) {
                        projects.data.forEach((p) => {
                            if (p.name.toLocaleLowerCase() === session.dialogData.task.projectName) {
                                session.dialogData.task.projectName = p.name;
                                session.dialogData.task.projectId = p.id;
                            }
                        });
                    }
                    session.dialogData.projects = projects.data;
                }
                let task = session.dialogData.task;
                const options = session.dialogData.projects.map((p) => { return p.name; });
                options[options.length] = this.OptionCancel;
                if (!task.projectId || task.projectId <= 0) {
                    builder.Prompts.choice(session, "Escolha o projeto: ", options, { listStyle: builder.ListStyle.list });
                }
                else {
                    next();
                }
            }),
            (session, results, next) => {
                if (results.response && results.response.entity === this.OptionCancel) {
                    session.endConversation("Ok, depois você cadastra essa tarefa");
                    return;
                }
                const projects = session.dialogData.projects;
                const task = session.dialogData.task;
                if (task.projectId && task.projectId > 0) {
                    next();
                    return;
                }
                projects.forEach((p) => {
                    if (p.name.toLocaleLowerCase() === results.response.entity.toLocaleLowerCase()) {
                        task.projectName = p.name;
                        task.projectId = p.id;
                    }
                });
                session.dialogData.task = task;
                session.endDialogWithResult({ response: { task: session.dialogData.task } });
            }]);
        bot.dialog("/changeTaskBeforeCreate", [(session, args) => __awaiter(this, void 0, void 0, function* () {
                if (args && args.task) {
                    session.dialogData.task = args.task;
                }
                builder.Prompts.choice(session, "O que deseja alterar?", this.changeOptions, { listStyle: builder.ListStyle.button });
            }), (session, results, next) => {
                if (results.response.entity === this.OptionChangeTitle) {
                    session.dialogData.task.changed = true;
                    session.dialogData.task.title = undefined;
                    session.beginDialog("/getTaskTitle", { task: session.dialogData.task, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionChangeComplexity) {
                    session.dialogData.task.changed = true;
                    session.dialogData.task.complexity = undefined;
                    session.beginDialog("/getTaskComplexity", { task: session.dialogData.task, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionChangeProject) {
                    session.dialogData.task.changed = true;
                    session.dialogData.task.projectName = undefined;
                    session.dialogData.task.projectId = undefined;
                    session.dialogData.task.areaId = undefined;
                    session.dialogData.task.areaName = undefined;
                    session.beginDialog("/getTaskProject", {
                        projects: session.dialogData.projects,
                        retry: false,
                        task: session.dialogData.task,
                    });
                    return;
                }
                if (results.response.entity === this.OptionChangeArea) {
                    session.dialogData.task.changed = true;
                    session.dialogData.task.areaName = undefined;
                    session.dialogData.task.areaId = undefined;
                    session.beginDialog("/getTaskArea", { retry: false, task: session.dialogData.task });
                    return;
                }
                if (results.response.entity === this.OptionChangeDescription) {
                    session.dialogData.task.changed = true;
                    session.dialogData.task.description = undefined;
                    session.beginDialog("/getTaskDescription", { retry: false, task: session.dialogData.task });
                    return;
                }
                if (results.response.entity === this.OptionCancel) {
                    session.send("Ok! Depois tentamos novamente");
                    session.clearDialogStack();
                    return;
                }
                session.dialogData.task.changed = false;
                next();
            },
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                if (results.response && results.response.task) {
                    session.dialogData.task = results.response.task;
                }
                if (session.dialogData.task.changed) {
                    session.replaceDialog("/confirmTaskCreation", { task: session.dialogData.task });
                    return;
                }
                next();
            })]);
        bot.dialog("/confirmTaskCreation", [(session, args) => __awaiter(this, void 0, void 0, function* () {
                if (args && args.task) {
                    session.dialogData.task = args.task;
                }
                if (args && args.projects) {
                    session.dialogData.projects = args.projects;
                }
                const task = session.dialogData.task;
                // tslint:disable-next-line:max-line-length
                let msg = "Hum, deixe-me ver... Já tenho o que preciso para cadastrar essa tarefa," +
                    "apenas confirme os dados: \n\n";
                let options = this.confirmationOptions;
                if (args && args.errorOnSave) {
                    msg = `Ocorreu o seguinte erro ao criar a tarefa "${args.errorOnSave}" \n\n`;
                    options[0] = this.OptionTryAgain;
                }
                msg += `**Projeto:** ${task.projectName} \n\n`;
                if (task.areaName && task.areaName.length > 0) {
                    msg += `**Área:** ${task.areaName}; \n\n`;
                }
                msg += `**Título:** ${task.title}; \n\n` +
                    `**Complexidades:** ${task.complexity}; \n\n`;
                if (task.description && task.description.length > 0
                    && task.description[0] && task.description[0].length > 0) {
                    msg += `**Descrição:** ${task.description[0]}; \n\n`;
                }
                session.send(msg);
                builder.Prompts.choice(session, "Posso prosseguir?", options, { listStyle: builder.ListStyle.button });
            }), (session, results, next) => {
                if (results.response.entity === this.OptionChange) {
                    session.replaceDialog("/changeTaskBeforeCreate", { task: session.dialogData.task, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionCancel) {
                    session.send("Ok! depois tentamos novamente...");
                    session.clearDialogStack();
                    return;
                }
                session.dialogData.task.changed = false;
                next();
            },
            (session, results) => __awaiter(this, void 0, void 0, function* () {
                if (results.response && results.response.task) {
                    session.dialogData.task = results.response.task;
                }
                if (session.dialogData.task.changed) {
                    session.replaceDialog("/confirmTaskCreation", { task: session.dialogData.task });
                    return;
                }
                if (results.response && results.response.task) {
                    session.dialogData.task = results.response.task;
                }
                const task = session.dialogData.task;
                const [err, result] = yield await_to_js_1.default(iteratorService_1.IteratorService.createTask(session.userData.user, { id: task.projectId, name: task.projectName }, { id: task.areaId, name: task.areaName }, task.title, task.complexity, task.description && task.description[0] ? task.description[0] : ""));
                if (err || !result.success) {
                    session.replaceDialog("/confirmTaskCreation", { task: session.dialogData.task, errorOnSave: (result || err).message });
                    return;
                }
                session.endDialog(`Tarefa ${result.data.id} cadastrada com sucesso!`);
            })]);
    }
}
exports.TaskDialogs = TaskDialogs;
//# sourceMappingURL=taskDialogs.js.map