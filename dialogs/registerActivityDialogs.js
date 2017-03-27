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
const iteratorBaseRepository_1 = require("../domain/repositories/iteratorBaseRepository");
const iteratorService_1 = require("../domain/services/iteratorService");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
const IS = new iteratorService_1.IteratorService();
const TR = new itemBacklogRepository_1.ItembacklogRepository();
class RegisterActivityDialogs {
    constructor() {
        this.OptionOk = "Pode confirmar!";
        this.OptionTryAgain = "Tentar novamente... agora vai!";
        this.OptionChangeTitle = "Alterar o título";
        this.OptionChangeComplexity = "Alterar a complexidade";
        this.OptionChangeTask = "Alterar a tarefa";
        this.OptionCancel = "Deixa para lá, não quero mais lançar essa atividade.";
        this.OptionSearchOtherTask = "Procurar outra tarefa";
        this.confirmationOptions = [
            this.OptionOk,
            this.OptionChangeTitle,
            this.OptionChangeComplexity,
            this.OptionChangeTask,
            this.OptionCancel,
        ];
    }
    setup(bot) {
        bot.dialog("/getActivityTitle", [(session, args) => {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                if (session.dialogData.activity.title && session.dialogData.activity.title.length >= 3) {
                    return;
                }
                builder.Prompts.text(session, !args.retry ?
                    "Por favor, poderia informar o título da atividade?"
                    : "Informe ao menos 3 caracteres para o título da atividade: ");
            }, (session, results) => {
                if (results.response && results.response.length <= 3) {
                    session.replaceDialog("/getActivityTitle", { activity: session.dialogData.activity, retry: true });
                    return;
                }
                session.dialogData.activity.title = results.response;
                session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
            }]);
        bot.dialog("/getActivityComplexity", [(session, args) => {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                if (session.dialogData.activity.complexity
                    && session.dialogData.activity.complexity > 0) {
                    return;
                }
                builder.Prompts.text(session, !args.retry ?
                    "Por favor, poderia informar a complexidade da atividade?"
                    : "Não entendi, a complexidade precisa ser meio(a), 0,5, 0.5, 1, 2 ou 3. Poderia informar?");
            }, (session, results) => {
                if (results.response) {
                    const complexity = iteratorService_1.IteratorService.convertComplexity2Number(results.response);
                    if (complexity <= 0) {
                        session.replaceDialog("/getActivityComplexity", { activity: session.dialogData.activity, retry: true });
                        return;
                    }
                    session.dialogData.activity.complexity = complexity;
                }
                session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
            }]);
        bot.dialog("/getTaskNameForSearchTask", [(session, args) => {
                session.dialogData.activity = args.activity;
                let q = args.activity.taskName && args.activity.taskName.length > 0 ?
                    `Acho que não entendi o título '${args.activity.taskName}', ` +
                        "poderia informar outro título para que eu pesquise?"
                    : "Poderia informar a tarefa para que eu pesquise?";
                q = q + " \n\nSe souber o número é só escrever aqui que prosseguimos daqui mesmo";
                builder.Prompts.text(session, q + "\n\nVocê também pode informar 0 " +
                    "ou cancelar que encerramos esse cadastro agora");
            }, (session, results) => {
                if (parseInt(results.response, 10) === 0 || results.response.toLowerCase() === "cancelar") {
                    session.endConversation("Ok, depois continuamos então");
                    return;
                }
                if (parseInt(results.response, 10) > 0) {
                    session.dialogData.activity.taskId = parseInt(results.response, 10);
                    session.dialogData.activity.taskName = undefined;
                    session.replaceDialog("/getActivityTaskId", { activity: session.dialogData.activity });
                    return;
                }
                session.dialogData.activity.taskName = results.response;
                session.replaceDialog("/searchTaskForActivity", { activity: session.dialogData.activity });
            }]);
        bot.dialog("/searchTaskForActivity", [(session, args) => __awaiter(this, void 0, void 0, function* () {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                let activity = session.dialogData.activity;
                if (activity.taskId && activity.taskId > 0) {
                    return;
                }
                if (activity.taskName && activity.taskName.length > 0) {
                    session.sendTyping();
                    const [err, searchResult] = yield await_to_js_1.default(iteratorService_1.IteratorService.search(session.userData.user, false, [activity.project], [], ["opentask"], activity.taskName, 10));
                    if (err || !searchResult.success) {
                        session.endConversation("Ocorreu o seguinte erro ao buscar a tarefa:" +
                            `\n\n\t ${(searchResult || err).message} ` +
                            "\n\n Por favor, tente novamente ou acione o suporte.");
                        return;
                    }
                    if (!searchResult.data || !searchResult.data[0]) {
                        session.replaceDialog("/getTaskNameForSearchTask", { activity: session.dialogData.activity });
                        return;
                    }
                    if (searchResult.data[0].items.length === 1) {
                        activity.taskId = searchResult.data[0].items[0].id;
                        session.endDialogWithResult({ response: { activity } });
                        return;
                    }
                    let options = [];
                    for (let d of searchResult.data) {
                        for (let i of d.items) {
                            options[options.length] = `${i.id} - ${i.name}`;
                        }
                    }
                    options[options.length] = this.OptionSearchOtherTask;
                    session.dialogData.possibleTasks = options;
                    builder.Prompts.choice(session, "Encontrei várias tarefas possíveis, qual seria?", options, { listStyle: builder.ListStyle.list });
                }
            }), (session, results) => {
                if (results.response) {
                    if (results.response.entity === this.OptionSearchOtherTask) {
                        session.replaceDialog("/getTaskNameForSearchTask", { activity: session.dialogData.activity });
                        return;
                    }
                    const choice = results.response.entity.split(" - ");
                    session.dialogData.activity.taskId = choice[0];
                    session.dialogData.activity.taskName = choice[1];
                }
                session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
            }]);
        bot.dialog("/getActivityTaskId", [(session, args, next) => __awaiter(this, void 0, void 0, function* () {
                if (args && args.activity) {
                    session.dialogData.activity = args.activity;
                }
                if (!session.dialogData.activity || !session.dialogData.activity.taskId) {
                    session.replaceDialog("/getTaskNameForSearchTask", { activity: session.dialogData.activity });
                }
                else {
                    next();
                }
            }),
            (session, results) => __awaiter(this, void 0, void 0, function* () {
                if (results.response >= 0) {
                    const taskId = parseInt(results.response, 10);
                    if (taskId === 0) {
                        session.send("Ok! depois tentamos novamente...");
                        session.clearDialogStack();
                        return;
                    }
                    session.dialogData.activity.taskId = taskId;
                }
                session.sendTyping();
                const [err, validationResult] = yield await_to_js_1.default(iteratorService_1.IteratorService.validateTaskForNewActivity(session.userData.user, session.dialogData.activity.taskId));
                if (validationResult.success) {
                    session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
                }
                else {
                    session.dialogData.activity.taskId = undefined;
                    session.send(`hum... essa tarefa está com o seguinte problema:` +
                        `\n\n\t ${(validationResult || err).message}`);
                    session.replaceDialog("/getActivityTaskId", { activity: session.dialogData.activity, retry: true });
                }
            }),
        ]);
        bot.dialog("/confirmActivityCreation", [(session, args) => __awaiter(this, void 0, void 0, function* () {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                const activity = session.dialogData.activity;
                // tslint:disable-next-line:max-line-length
                let msg = "Hum, deixe-me ver... Já tenho o que preciso para cadastrar sua atividade, apenas confirme os dados: \n\n";
                let options = this.confirmationOptions;
                if (args.errorOnSave) {
                    msg = `Ocorreu o seguinte erro ao criar a atividade "${args.errorOnSave}" \n\n`;
                    options[0] = this.OptionTryAgain;
                }
                const [err, resultTask] = yield await_to_js_1.default(TR.load(activity.taskId));
                if (resultTask.success) {
                    activity.taskName = resultTask.data.title;
                }
                session.send(msg +
                    `Título: ${activity.title}; \n\n` +
                    `Complexidades: ${activity.complexity}; \n\n` +
                    `Tarefa: ${activity.taskId} - ${activity.taskName}.`);
                builder.Prompts.choice(session, "Escolha uma opção: ", options, { listStyle: builder.ListStyle.list });
            }), (session, results) => {
                if (results.response.entity === this.OptionOk
                    || results.response.entity === this.OptionTryAgain) {
                    session.dialogData.activity.changed = false;
                    session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
                    return;
                }
                if (results.response.entity === this.OptionChangeTitle) {
                    session.dialogData.activity.changed = true;
                    session.dialogData.activity.title = undefined;
                    session.beginDialog("/getActivityTitle", { activity: session.dialogData.activity, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionChangeComplexity) {
                    session.dialogData.activity.changed = true;
                    session.dialogData.activity.complexity = undefined;
                    session.beginDialog("/getActivityComplexity", { activity: session.dialogData.activity, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionChangeTask) {
                    session.dialogData.activity.changed = true;
                    session.dialogData.activity.taskId = undefined;
                    session.dialogData.activity.taskName = undefined;
                    session.beginDialog("/getTaskNameForSearchTask", { activity: session.dialogData.activity, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionCancel) {
                    session.send("Ok! depois tentamos novamente...");
                    session.clearDialogStack();
                    return;
                }
            },
            (session, results) => {
                if (results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                if (session.dialogData.activity.changed) {
                    session.replaceDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
                    return;
                }
                session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
            }]);
    }
}
exports.RegisterActivityDialogs = RegisterActivityDialogs;
//# sourceMappingURL=registerActivityDialogs.js.map