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
        this.confirmationOptions = [
            this.OptionOk,
            this.OptionChangeTitle,
            this.OptionChangeComplexity,
            this.OptionChangeTask,
            this.OptionCancel,
        ];
    }
    setup(bot) {
        bot.dialog("/getActivityTitle", [(session, args, next) => {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                if (session.dialogData.activity.title && session.dialogData.activity.title.length >= 3) {
                    next();
                }
                else {
                    builder.Prompts.text(session, !args.retry ?
                        "Por favor, poderia informar o título da atividade?"
                        : "Informe ao menos 3 caracteres para o título da atividade: ");
                }
            }, (session, results, next) => {
                if (results.response && results.response.length <= 3) {
                    session.replaceDialog("/getActivityTitle", { activity: session.dialogData.activity, retry: true });
                    return;
                }
                session.dialogData.activity.title = results.response;
                next({ activity: session.dialogData.activity });
            }]);
        bot.dialog("/getActivityComplexity", [(session, args, next) => {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                if (session.dialogData.activity.complexity
                    && session.dialogData.activity.complexity > 0) {
                    next();
                }
                else {
                    builder.Prompts.text(session, !args.retry ?
                        "Por favor, poderia informar a complexidade da atividade?"
                        : "Não entendi, a complexidade precisa ser meio(a), 0.5, 1, 2 ou 3. Poderia informar?");
                }
            }, (session, results, next) => {
                if (results.response) {
                    const complexity = iteratorService_1.IteratorService.convertComplexity2Number(results.response);
                    if (complexity <= 0) {
                        session.replaceDialog("/getActivityComplexity", { activity: session.dialogData.activity, retry: true });
                        return;
                    }
                    session.dialogData.activity.complexity = complexity;
                }
                next({ activity: session.dialogData.activity });
            }]);
        bot.dialog("/getActivityTaskId", [(session, args, next) => __awaiter(this, void 0, void 0, function* () {
                if (args.activity) {
                    session.dialogData.activity = args.activity;
                }
                if (!session.dialogData.activity.taskId) {
                    builder.Prompts.number(session, !args.retry ?
                        "Poderia informar em qual tarefa devo lançar as complexidades?"
                        : "Informe outra tarefa para que eu possa lançar, se quiser cancelar, é só informar \"0\" que encerramos esse cadastro");
                }
                else {
                    next();
                }
            }),
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                if (results.response >= 0) {
                    const taskId = parseInt(results.response, 10);
                    if (taskId === 0) {
                        session.send("Ok! depois tentamos novamente...");
                        session.clearDialogStack();
                        return;
                    }
                    session.dialogData.activity.taskId = taskId;
                }
                session.send("Ok, validando a tarefa escolhida...");
                session.sendTyping();
                const validationResult = yield iteratorService_1.IteratorService.ValidateTaskForNewActivity(session.userData.user, session.dialogData.activity.taskId);
                if (validationResult.success) {
                    next({ activity: session.dialogData.activity });
                }
                else {
                    session.dialogData.activity.taskId = undefined;
                    session.send(`hum... essa tarefa está com o seguinte problema: ${validationResult.message}`);
                    session.replaceDialog("/getActivityTaskId", { activity: session.dialogData.activity, retry: true });
                }
            }),
        ]);
        bot.dialog("/confirmActivityCreation", [(session, args, next) => __awaiter(this, void 0, void 0, function* () {
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
                const resultTask = yield TR.load(activity.taskId);
                if (resultTask.success) {
                    activity.taskName = resultTask.data.title;
                }
                session.send(msg +
                    `Título: ${activity.title}; \n\n` +
                    `Complexidades: ${activity.complexity}; \n\n` +
                    `Tarefa: ${activity.taskId} - ${activity.taskName}.`);
                builder.Prompts.choice(session, "Escolha uma opção: ", options, { listStyle: builder.ListStyle.list });
            }), (session, results, next) => {
                if (results.response.entity === this.OptionOk
                    || results.response.entity === this.OptionTryAgain) {
                    session.dialogData.activity.changed = false;
                    next({ activity: session.dialogData.activity });
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
                    session.beginDialog("/getActivityTaskId", { activity: session.dialogData.activity, retry: false });
                    return;
                }
                if (results.response.entity === this.OptionCancel) {
                    session.send("Ok! depois tentamos novamente...");
                    session.clearDialogStack();
                    return;
                }
            },
            (session, results, next) => {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }
                if (session.dialogData.activity.changed) {
                    session.replaceDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
                    return;
                }
                next({ activity: session.dialogData.activity });
            }]);
    }
}
exports.RegisterActivityDialogs = RegisterActivityDialogs;
//# sourceMappingURL=registerActivityDialogs.js.map