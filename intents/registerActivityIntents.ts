import to from "await-to-js";
import * as builder from "botbuilder";
import { IActivityResponse } from "../dialogs/registerActivityDialogs";
import { Activity, Task } from "../domain/entities";
import { IteratorService } from "../domain/services/service";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class RegisterActivityIntents extends IntentBase {

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("register_activity", [
            (session, args, next) => {
                if (!session.userData.user
                || !session.userData.user.id
                || session.userData.user.id <= 0) {
                    session.send("Antes de lançar tarefas preciso ter certeza de quem é você no Iterator." +
                                "Depois que você logar poderemos criar tarefas para você, ok?");
                    session.replaceDialog("/profile");
                    return;
                }

                const title = builder.EntityRecognizer.findEntity(args.entities, IE.Text);
                const complexity = builder.EntityRecognizer.findEntity(args.entities, IE.Complexity);
                const taskid = builder.EntityRecognizer.findEntity(args.entities, IE.EntityId);
                const taskname = builder.EntityRecognizer.findEntity(args.entities, IE.Target);
                const project = builder.EntityRecognizer.findEntity(args.entities, IE.Location);

                let activity = <Activity> {
                    complexity: complexity && complexity.entity ?
                        IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    id: 0,
                    project: project ? project.entity : undefined,
                    taskId: taskid && taskid.entity ?
                        parseInt(taskid.entity, 10) : undefined,
                    taskName: taskname ? taskname.entity : undefined,
                    title: title ? title.entity.replace("\"", "") : undefined,
                };

                session.dialogData.activity = activity;

                if (!activity.title || activity.title.length < 3) {
                    session.beginDialog("/getActivityTitle", { activity: session.dialogData.activity });
                } else {
                    next();
                }
            },
            (session, results: builder.IDialogResult<IActivityResponse>, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }

                let activity = session.dialogData.activity;

                if (!activity.complexity) {
                    session.beginDialog("/getActivityComplexity", { activity: session.dialogData.activity });
                } else {
                    next();
                }
            },
            (session, results: builder.IDialogResult<IActivityResponse>, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }

                let activity = <Activity> session.dialogData.activity;

                if (!activity.taskId && activity.taskName && activity.taskName.length > 0) {
                    session.beginDialog("/searchTaskForActivity", { activity: session.dialogData.activity });
                } else {
                    next();
                }
            },
            (session, results: builder.IDialogResult<IActivityResponse>, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }

                let activity = <Activity> session.dialogData.activity;

                session.beginDialog("/getActivityTaskId", { activity: session.dialogData.activity});
            },
            (session, results: builder.IDialogResult<IActivityResponse>, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }

                session.beginDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
            },
            async (session, results: builder.IDialogResult<IActivityResponse>, next) => {
                if (results.response && results.response.activity) {
                    session.dialogData.activity = results.response.activity;
                }
                const activity = <Activity> session.dialogData.activity;

                const [err, result] = await to(IteratorService.createActivity(
                    session.userData.user, activity.taskId, activity.title, activity.complexity));

                if (err || !result.success) {
                    session.beginDialog("/confirmActivityCreation",
                        { activity: session.dialogData.activity, errorOnSave: (result.message || err.message) });
                    return;
                }

                session.endDialog("Atividade cadastrada com sucesso!");
            },
        ]);
    }
}
