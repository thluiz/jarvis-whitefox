import * as builder from "botbuilder";
import { Activity, Task } from "../domain/entities";
import { IteratorService } from "../domain/services/service";
import { IntentBase } from "./intentBase";

export class RegisterActivityIntents extends IntentBase {

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("register_activity", [
            (session, args, next) => {
                const title = builder.EntityRecognizer.findEntity(args.entities, "text");
                const complexity = builder.EntityRecognizer.findEntity(args.entities, "complexity");
                const taskid = builder.EntityRecognizer.findEntity(args.entities, "entityId");

                let activity = <Activity> {
                    complexity: complexity && complexity.entity ?
                        IteratorService.convertComplexity2Number(complexity.entity) : undefined,
                    id: 0,
                    taskId: taskid && taskid.entity ?
                        parseInt(taskid.entity, 10) : undefined,
                    title: title ? title.entity.replace("\"", "") : undefined,
                };

                session.dialogData.activity = activity;

                if (!activity.title || activity.title.length < 3) {
                    session.beginDialog("/getActivityTitle", { activity: session.dialogData.activity });
                } else {
                    next();
                }
            }
            ,
            (session, results, next) => {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }

                let activity = session.dialogData.activity;

                if (!activity.complexity) {
                    session.beginDialog("/getActivityComplexity", { activity: session.dialogData.activity });
                } else {
                    next();
                }
            },
            (session, results, next) => {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }

                let activity = <Activity> session.dialogData.activity;

                session.beginDialog("/getActivityTaskId", { activity: session.dialogData.activity});
            },
            (session, results, next) => {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }

                session.beginDialog("/confirmActivityCreation", { activity: session.dialogData.activity });
            },
            async (session, results, next) => {
                if (results.activity) {
                    session.dialogData.activity = results.activity;
                }
                const activity = <Activity> session.dialogData.activity;

                const result = await IteratorService.createActivity(
                    session.userData.user, activity.taskId, activity.title, activity.complexity);

                if (!result.success) {
                    session.beginDialog("/confirmActivityCreation",
                        { activity: session.dialogData.activity, errorOnSave: result.message });
                    return;
                }

                session.endDialog("Tarefa cadastrada com sucesso!");
            },
        ]);
    }
}
