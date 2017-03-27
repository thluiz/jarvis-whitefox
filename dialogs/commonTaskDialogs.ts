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

export class CommonTaskActionsDialogs implements IDialogBase {
    public setup(bot: builder.UniversalBot): void {
        bot.dialog("/getTaskTitle", [(session, args) => {
            if (args.task) {
                session.dialogData.task = args.task;
            }

            if (session.dialogData.task.title && session.dialogData.task.title.length >= 3) {
                return;
            } else {
                builder.Prompts.text(session, !args.retry ?
                    "Por favor, poderia informar o título da tarefa?"
                    : "Informe ao menos 3 caracteres para o título da tarefa: ");
            }
        }, (session, results) => {
            if (results.response && results.response.length <= 3) {
                session.replaceDialog("/getTaskTitle",
                    { task: session.dialogData.task, retry: true });
                return;
            }

            session.dialogData.task.title = results.response;
            session.endDialogWithResult({ response: { task: session.dialogData.task }});
        }],
        );

        bot.dialog("/getTaskComplexity", [(session, args) => {
            if (!args.task) {
                session.endDialog("Deveria ter enviado a tarefa para alteração");
                return;
            }

            session.dialogData.task = args.task;

            if (session.dialogData.task.complexity && session.dialogData.task.complexity > 0) {
                return;
            } else {
                builder.Prompts.text(session, !args.retry ?
                    "Por favor, poderia informar a complexidade da tarefa?"
                    : "Não entendi, a complexidade precisa ser meio(a), 0.5, 1, 2, 3, 5, 8... Poderia informar? ");
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

            session.endDialogWithResult({ response: { task: session.dialogData.task }} );
        }],
        );
    }
}
