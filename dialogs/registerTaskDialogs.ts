
import * as builder from "botbuilder";
import { Task } from "../domain/entities";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { Result } from "../domain/result";
import { IteratorService } from "../domain/services/iteratorService";
import { SecurityService } from "../domain/services/SecurityService";
import { IDialogBase } from "./dialogBase";

const IR = new IteratorBaseRepository();
const IS = new IteratorService();

export class RegisterTaskDialogs implements IDialogBase {
    private OptionOk = "Manda Brasa!";
    private OptionTryAgain = "Por favor, tente novamente...";
    private OptionChangeTitle = "Alterar o título";
    private OptionChangeComplexity = "Alterar a complexidade";
    private OptionChangeTask = "Alterar o projeto";
    private OptionCancel = "Melhor cancelar, depois tento novamente";

    private confirmationOptions = [
        this.OptionOk,
        this.OptionChangeTitle,
        this.OptionChangeComplexity,
        this.OptionChangeTask,
        this.OptionCancel,
    ];

    public setup(bot: builder.UniversalBot): void {
        bot.dialog("/getTaskTitle", [(session, args, next) => {
            if (args.task) {
                session.dialogData.task = args.task;
            }

            if (session.dialogData.task.title && session.dialogData.task.title.length >= 3) {
                next();
            } else {
                builder.Prompts.text(session, !args.retry ?
                    "Por favor, poderia informar o título da tarefa?"
                    : "Informe ao menos 3 caracteres para o título da tarefa: ");
            }
        }, (session, results, next) => {
            if (results.response && results.response.length <= 3) {
                session.replaceDialog("/getTaskTitle",
                    { task: session.dialogData.task, retry: true });
                return;
            }

            session.dialogData.task.title = results.response;
            next(<builder.IDialogResult<Task>> { task: session.dialogData.task });
        }],
        );

        bot.dialog("/getTaskComplexity", [(session, args, next) => {
            if (args.task) {
                session.dialogData.task = args.task;
            }

            if (session.dialogData.task.complexity
                && session.dialogData.task.complexity > 0) {
                next();
            } else {
                builder.Prompts.text(session, !args.retry ?
                    "Por favor, poderia informar a complexidade da tarefa?"
                    : "Não entendi, a complexidade precisa ser meio(a), 0.5, 1, 2 ou 3. Poderia informar? ");
            }
        }, (session, results, next) => {
            if (results.response) {
                const complexity = IteratorService.convertComplexity2Number(results.response);
                if (complexity <= 0) {
                    session.replaceDialog("/getTaskComplexity",
                        { task: session.dialogData.task, retry: true });
                    return;
                }
                session.dialogData.task.complexity = complexity;
            }

            next(<builder.IDialogResult<Task>>{ task: session.dialogData.task });
        }],
        );

        bot.dialog("/getTaskProjectId", [async (session, args, next) => {
            if (args.task) {
                session.dialogData.task = args.task;
            }

            if (!session.dialogData.task.projectId) {
                builder.Prompts.number(session, !args.retry ?
                    "Poderia informar em qual tarefa devo lançar as complexidades?"
                    // tslint:disable-next-line:max-line-length
                    : "Informe outra tarefa para que eu possa lançar, se quiser cancelar, é só informar \"0\" que encerramos esse cadastro");
            } else {
                next();
            }
        },
        async (session, results, next) => {
            if (results.response >= 0) {
                const projectId = parseInt(results.response, 10);
                if (projectId === 0) {
                    session.send("Ok! depois tentamos novamente...");
                    session.clearDialogStack();
                    return;
                }
                session.dialogData.task.taskId = projectId;
            }

            session.send("Ok, validando a tarefa escolhida...");
            session.sendTyping();
            const validationResult = await IteratorService.ValidateProjectForNewTask(
                session.userData.user, session.dialogData.task.projectId);

            if (validationResult.success) {
                next(<builder.IDialogResult<Task>> { task: session.dialogData.task });
            } else {
                session.dialogData.task.projectId = undefined;
                session.send(`hum... esse projeto está com o seguinte problema: ${validationResult.message}`);
                session.replaceDialog("/getTaskProjectId",
                    { task: session.dialogData.task, retry: true });
            }
        },
        ]);

        bot.dialog("/confirmTaskCreation", [(session, args, next) => {
            if (args.task) {
                session.dialogData.task = args.task;
            }

            const task = <Task> session.dialogData.task;
            // tslint:disable-next-line:max-line-length
            let msg =  "Hum, deixe-me ver... Já tenho o que preciso para cadastrar sua atividade, apenas confirme os dados: \n\n";
            let options = this.confirmationOptions;

            if (args.errorOnSave) {
                msg = `Ocorreu o seguinte erro ao criar a tarefa "${args.errorOnSave}" \n\n`;
                options[0] = this.OptionTryAgain;
            }

            session.send(msg +
                `Título: ${task.title}; \n\n` +
                `Complexidades: ${task.complexity}; \n\n` +
                `Projeto: ${task.projectName}.`);

            builder.Prompts.choice(session, "Escolha uma opção: ", options,
                { listStyle: builder.ListStyle.list });
        }, (session, results, next) => {
            if (results.response.entity === this.OptionOk
                || results.response.entity === this.OptionTryAgain) {
                session.dialogData.task.changed = false;
                next(<builder.IDialogResult<Task>> { task: session.dialogData.task });
                return;
            }

            if (results.response.entity === this.OptionChangeTitle) {
                session.dialogData.task.changed = true;
                session.dialogData.task.title = undefined;
                session.beginDialog("/getTaskTitle",
                    { task: session.dialogData.task, retry: false });
                return;
            }

            if (results.response.entity === this.OptionChangeComplexity) {
                session.dialogData.task.changed = true;
                session.dialogData.task.complexity = undefined;
                session.beginDialog("/getTaskComplexity",
                    { Task: session.dialogData.task, retry: false });
                return;
            }

            if (results.response.entity === this.OptionChangeTask) {
                session.dialogData.task.changed = true;
                session.dialogData.task.taskId = undefined;
                session.beginDialog("/getTaskProjectId",
                    { task: session.dialogData.task, retry: false });
                return;
            }

            if (results.response.entity === this.OptionCancel) {
                session.send("Ok! depois tentamos novamente...");
                session.clearDialogStack();
                return;
            }
        },
        (session, results, next) => {
            if (results.task) {
                session.dialogData.task = results.task;
            }

            if (session.dialogData.task.changed) {
                session.replaceDialog("/confirmTaskCreation", { task: session.dialogData.task });
                return;
            }

            next(<builder.IDialogResult<Task>> { task: session.dialogData.task });
        }],
        );
    }
}