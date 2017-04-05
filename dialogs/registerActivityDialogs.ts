import to from "await-to-js";
import * as builder from "botbuilder";
import { isNumber } from "util";
import { Activity } from "../domain/entities/activity";
import { ItembacklogRepository } from "../domain/repositories/itemBacklogRepository";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { Result } from "../domain/result";
import { IteratorService } from "../domain/services/iteratorService";
import { SecurityService } from "../domain/services/SecurityService";
import { IDialogBase } from "./dialogBase";

const IR = new IteratorBaseRepository();
const IS = new IteratorService();
const TR = new ItembacklogRepository();

export interface IActivityResponse {
    activity: Activity;
    retry: boolean;
}

export class RegisterActivityDialogs implements IDialogBase {
    private OptionOk = "Sim";
    private OptionTryAgain = "Tentar novamente";
    private OptionChangeData = "Alterar";
    private OptionCancel = "Cancelar";
    private OptionChangeTitle = "Título";
    private OptionChangeComplexity = "Complexidade";
    private OptionChangeTask = "Tarefa";
    private OptionCancelChange = "Não alterar";
    private OptionSearchOtherTask = "Procurar outra tarefa";

    private confirmationOptions = [
        this.OptionOk,
        this.OptionChangeData,
        this.OptionCancel,
    ];

    private changeOptions = [
        this.OptionChangeTitle,
        this.OptionChangeComplexity,
        this.OptionChangeTask,
        this.OptionCancelChange,
        this.OptionCancel,
    ];

    public setup(bot: builder.UniversalBot): void {
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
                session.replaceDialog("/getActivityTitle",
                    { activity: session.dialogData.activity, retry: true });
                return;
            }

            session.dialogData.activity.title = results.response;
            session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
        }],
        );

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
                const complexity = IteratorService.convertComplexity2Number(results.response);
                if (complexity <= 0) {
                    session.replaceDialog("/getActivityComplexity",
                        { activity: session.dialogData.activity, retry: true });
                    return;
                }
                session.dialogData.activity.complexity = complexity;
            }

            session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
        }],
        );

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
            if (parseInt(results.response, 10) === 0 || (<string>results.response).toLowerCase() === "cancelar") {
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

        bot.dialog("/searchTaskForActivity", [async (session, args) => {
            if (args.activity) {
                session.dialogData.activity = args.activity;
            }

            let activity = <Activity>session.dialogData.activity;

            if (activity.taskId && activity.taskId > 0) {
                return;
            }

            if (activity.taskName && activity.taskName.length > 0) {
                session.sendTyping();
                const [err, searchResult] = await to(IteratorService.search(session.userData.user, false,
                    [activity.project], [], ["opentask"], activity.taskName, 10));

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
                builder.Prompts.choice(session, "Encontrei várias tarefas possíveis, qual seria?", options,
                    { listStyle: builder.ListStyle.list });
            }
        }, (session, results) => {
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
        }],
        );

        bot.dialog("/getActivityTaskId", [async (session, args, next) => {
            if (args && args.activity) {
                session.dialogData.activity = args.activity;
            }

            if (!session.dialogData.activity || !session.dialogData.activity.taskId) {
                session.replaceDialog("/getTaskNameForSearchTask", { activity: session.dialogData.activity });
            } else {
                next();
            }
        },
        async (session, results) => {
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

            const [err, validationResult] = await to(IteratorService.validateTaskForNewActivity(
                session.userData.user, session.dialogData.activity.taskId));

            if (validationResult.success) {
                session.endDialogWithResult({ response: { activity: session.dialogData.activity } });
            } else {
                session.dialogData.activity.taskId = undefined;
                session.send(`hum... essa tarefa está com o seguinte problema:` +
                    `\n\n\t ${(validationResult || err).message}`);

                session.replaceDialog("/getActivityTaskId",
                    { activity: session.dialogData.activity, retry: true });
            }
        },
        ]);

        bot.dialog("/confirmActivityCreation", [async (session, args) => {
            if (args && args.activity) {
                session.dialogData.activity = args.activity;
            }

            const activity = <Activity>session.dialogData.activity;
            // tslint:disable-next-line:max-line-length
            let msg = "Hum, deixe-me ver... Já tenho o que preciso para cadastrar sua atividade, apenas confirme os dados: \n\n";
            let options = this.confirmationOptions;

            if (args && args.errorOnSave) {
                msg = `Ocorreu o seguinte erro ao criar a atividade "${args.errorOnSave}" \n\n`;
                options[0] = this.OptionTryAgain;
            }

            if (!activity.taskName || activity.taskName.length <= 0) {
                const [err, resultTask] = await to(TR.load(activity.taskId));

                if (resultTask.success) {
                    activity.taskName = resultTask.data.title;
                }
            }

            session.send(msg +
                `**Título:** ${activity.title}; \n\n` +
                `**Complexidades:** ${activity.complexity}; \n\n` +
                `**Tarefa:** ${activity.taskId} - ${activity.taskName}.`);

            builder.Prompts.choice(session, "Posso prosseguir então?", options,
                { listStyle: builder.ListStyle.button });

        },
        (session, results, next) => {
            if (results.response.entity === this.OptionChangeData) {
                session.replaceDialog("/changeActivityBeforeCreate",
                    { activity: session.dialogData.activity, retry: false });
                return;
            }

            if (results.response.entity === this.OptionCancel) {
                session.send("Ok! depois tentamos novamente...");
                session.clearDialogStack();
                return;
            }

            session.dialogData.activity.changed = false;
            next();
        },
        async (session, results: builder.IDialogResult<IActivityResponse>) => {
            if (results.response && results.response.activity) {
                session.dialogData.activity = results.response.activity;
            }

            if (session.dialogData.activity.changed) {
                session.replaceDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
                return;
            }

            const activity = <Activity> session.dialogData.activity;

            session.sendTyping();
            const [err, result] = await to(IteratorService.createActivity(
                session.userData.user, activity.taskId, activity.title, activity.complexity));

            if (err || !result.success) {
                session.replaceDialog("/confirmActivityCreation",
                    { activity: session.dialogData.activity, errorOnSave: (result || err).message });
                return;
            }

            session.endDialog("Atividade cadastrada com sucesso!");
        }
        ]);

        bot.dialog("/changeActivityBeforeCreate", [async (session, args) => {
            if (args && args.activity) {
                session.dialogData.activity = args.activity;
            }

            builder.Prompts.choice(session, "O que deseja alterar?", this.changeOptions,
                { listStyle: builder.ListStyle.button });

        }, (session, results, next) => {
            if (results.response.entity === this.OptionChangeTitle) {
                session.dialogData.activity.changed = true;
                session.dialogData.activity.title = undefined;
                session.beginDialog("/getActivityTitle",
                    { activity: session.dialogData.activity, retry: false });
                return;
            }

            if (results.response.entity === this.OptionChangeComplexity) {
                session.dialogData.activity.changed = true;
                session.dialogData.activity.complexity = undefined;
                session.beginDialog("/getActivityComplexity",
                    { activity: session.dialogData.activity, retry: false });
                return;
            }

            if (results.response.entity === this.OptionChangeTask) {
                session.dialogData.activity.changed = true;
                session.dialogData.activity.taskId = undefined;
                session.dialogData.activity.taskName = undefined;
                session.beginDialog("/getTaskNameForSearchTask",
                    { activity: session.dialogData.activity, retry: false });
                return;
            }

            if (results.response.entity === this.OptionCancelChange) {
                session.replaceDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
                return;
            }

            if (results.response.entity === this.OptionCancel) {
                session.send("Ok! depois tentamos novamente...");
                session.clearDialogStack();
                return;
            }

            session.dialogData.activity.changed = false;
            next();
        },
        async (session, results: builder.IDialogResult<IActivityResponse>, next) => {
            if (results.response && results.response.activity) {
                session.dialogData.activity = results.response.activity;
            }

            if (session.dialogData.activity.changed) {
                session.replaceDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
                return;
            }

            next();
        }],
        );
    }
}
