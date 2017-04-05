import to from "await-to-js";
import * as builder from "botbuilder";
import { ITaskResponse } from "../dialogs/taskDialogs";
import { Task } from "../domain/entities";
import { IteratorService, UtilsService } from "../domain/services/service";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class RegisterTaskIntents extends IntentBase {
    private OptionCancel = "Pensando melhor, mais tarde cadastro essa tarefa...";

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("register_task", [
            async (session, args, next) => {
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

                const task = <Task> {
                    complexity: complexity && complexity.entity ?
                        IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    projectName: project ? project.entity : undefined,
                    title: title ?
                        UtilsService.capitalizeFirstLetter(
                            title.map((t) => {
                                return t.entity.replace("\"", "");
                            }).join(" "))
                        : undefined,
                };

                session.dialogData.task = task;

                if (!task.title || task.title.length < 3) {
                    session.beginDialog("/getTaskTitle", { task });
                } else {
                    next();
                }
            },
            (session, results, next) => {
                if (results && results.response) {
                    let task = results.response.task;
                    session.dialogData.task = results.response.task;
                }

                let task = session.dialogData.task;

                if (!task.complexity || task.complexity <= 0) {
                    session.beginDialog("/getTaskComplexity", { task });
                } else {
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
                } else {
                    next();
                }
            },
            (session, results: builder.IDialogResult<ITaskResponse>, next) => {
                if (results.response && results.response.task) {
                    session.dialogData.task = results.response.task;
                }

                session.beginDialog("/confirmTaskCreation", { task: session.dialogData.task });
            },
        ]);
    }
}
