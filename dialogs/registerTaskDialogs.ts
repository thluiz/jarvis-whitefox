import to from "await-to-js";
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
    private OptionChangeProject = "Alterar o projeto";
    private OptionChangeArea = "Alterar Área";
    private OptionChangeDescription = "Alterar Descrição";
    private OptionCancel = "Melhor cancelar, depois tento novamente";

    private confirmationOptions = [
        this.OptionOk,
        this.OptionChangeTitle,
        this.OptionChangeComplexity,
        this.OptionChangeProject,
        this.OptionChangeArea,
        this.OptionChangeDescription,
        this.OptionCancel,
    ];

    public setup(bot: builder.UniversalBot): void {
        bot.dialog("/confirmTaskCreation", [(session, args) => {
            if (args.task) {
                session.dialogData.task = args.task;
            }

            const task = <Task> session.dialogData.task;
            // tslint:disable-next-line:max-line-length
            let msg = "Já tenho o que preciso para essa Tarefa, apenas confirme os dados: \n\n";
            let options = this.confirmationOptions;

            if (args.errorOnSave) {
                msg = `Ocorreu o seguinte erro ao criar a tarefa "${args.errorOnSave}" \n\n`;
                options[0] = this.OptionTryAgain;
            }

            msg = msg +
                `Título: ${task.title}; \n\n` +
                `Complexidades: ${task.complexity}; \n\n` +
                `Projeto: ${task.projectName}.\n\n` +
                `Area: ${task.areaName || "Não definida"}`;

            if (task.description && task.description.length > 0) {
                msg = msg + `\n\nDescrição: ${task.description[0]}`;
            }

            session.send(msg);

            builder.Prompts.choice(session, "Escolha uma opção: ", options,
                { listStyle: builder.ListStyle.list });
        }, (session, results) => {
            if (results.response.entity === this.OptionOk
                || results.response.entity === this.OptionTryAgain) {
                session.dialogData.task.changed = false;
                session.endDialogWithResult({ response: { task: session.dialogData.task }});
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

            if (results.response.entity === this.OptionChangeProject) {
                session.dialogData.task.changed = true;
                let task = <Task> session.dialogData.task;
                task.projectId = undefined;
                task.projectName = undefined;

                session.beginDialog("/getTaskProject", { task , retry: false }); // TODO: implement
                return;
            }

            if (results.response.entity === this.OptionChangeArea) {
                session.dialogData.task.changed = true;
                let task = <Task> session.dialogData.task;
                task.areaId = undefined;
                task.areaName = undefined;
                session.beginDialog("/getTaskArea", { task, retry: false }); // TODO: implement
                return;
            }

            if (results.response.entity === this.OptionChangeDescription) {
                session.dialogData.task.changed = true;
                let task = <Task> session.dialogData.task;
                task.description = undefined;
                session.beginDialog("/getTaskDescription", { task, retry: false }); // TODO: implement
                return;
            }

            if (results.response.entity === this.OptionCancel) {
                session.send("Ok! depois tentamos novamente...");
                session.clearDialogStack();
                return;
            }
        },
        (session, results, next) => {
            if (results.response && results.response.task) {
                session.dialogData.task = results.task;
            }

            if (session.dialogData.task.changed) {
                session.replaceDialog("/confirmTaskCreation", { task: session.dialogData.task });
                return;
            }

            session.endDialogWithResult({ response: {task: session.dialogData.task }});
        }],
        );
    }
}
