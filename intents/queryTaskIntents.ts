import to from "await-to-js";
import * as builder from "botbuilder";
import { Task } from "../domain/entities";
import { ItembacklogRepository } from "../domain/repositories/itemBacklogRepository";
import { IteratorService, UtilsService } from "../domain/services/service";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();
const TR = new ItembacklogRepository();

export class QueryTaskIntents extends IntentBase {
    private OptionCancel = "Deixa para lá, não quero mais procurar";

    private TargetsRegExp = {
        activities: /^(atividade|lan(\ç|c)amento)/,
        description: /^(descri\ç)/,
        evidences: /^(evid(e|ê)ncia|anexo)/,
    };

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("query_task", [
            async (session, args, next) => {
                if (!session.userData.user
                    || !session.userData.user.id
                    || session.userData.user.id <= 0) {
                    session.send("Antes de verificar dados das tarefas precisamos ter certeza de quem é você." +
                        "Depois que você logar poderemos verificar os dados das tarefas dos seus projetos, ok?");
                    session.replaceDialog("/profile");
                    return;
                }

                const entityId = builder.EntityRecognizer.findEntity(args.entities, IE.EntityId);

                if (entityId && entityId.entity && parseInt(entityId.entity, 10) > 0) {
                    const [errTask, task] = await to(TR.load(parseInt(entityId.entity, 10)));

                    if (errTask || !task.success) {
                        session.send(`Ocorreu esse erro ao procurar a tarefa: ${(task || errTask).message}`);
                        return;
                    }

                    session.dialogData.task = task.data;
                    next();
                    return;
                }

                const locations = builder.EntityRecognizer.findAllEntities(args.entities, IE.Location);
                const projectOrBCs = builder.EntityRecognizer.findAllEntities(args.entities, IE.ProjectBillingCenter);
                const textEntities = builder.EntityRecognizer.findAllEntities(args.entities, IE.Text);

                const bt = UtilsService.has_billingcenter_bt(projectOrBCs);
                const poliedro = UtilsService.has_billingcenter_poliedro(projectOrBCs);

                session.dialogData.projects = UtilsService.extract_projects(projectOrBCs);
                session.dialogData.billingcenters = UtilsService.setup_billing_centers(bt, poliedro);
                session.dialogData.locations = UtilsService.setup_locations(locations);
                session.dialogData.text = textEntities ? textEntities.map((t) => { return t.entity; }).join(" ") : " ";

                session.dialogData.targets = builder.EntityRecognizer.findAllEntities(args.entities, IE.Target);
                session.dialogData.commands = builder.EntityRecognizer.findAllEntities(args.entities, IE.Command);

                if (!session.dialogData.text || session.dialogData.text.length <= 3) {
                    session.beginDialog("/getTaskTitle", { task: {} });
                    return;
                }

                next();
            },
            async (session, results, next) => {
                if (session.dialogData.task && session.dialogData.task.Id > 0) {
                    next();
                    return;
                }

                if (results && results.response) {
                    let task = results.response.task;
                    session.dialogData.text = results.response.task.title;
                }

                session.sendTyping();
                const [err, searchResult] = await to(IteratorService.search(session.userData.user, false,
                    session.dialogData.projects, session.dialogData.billingcenters,
                    session.dialogData.locations, session.dialogData.text));

                if (err || !searchResult.success) {
                    session.endDialog(`Ocorreu o seguinte erro: ${(searchResult || err).message}`);
                    return;
                }

                if (!searchResult.data || searchResult.data.length === 0) {
                    session.endDialog("Nenhum registro encontrado!");
                    return;
                }

                if (searchResult.data.length === 1 && searchResult.data[0].items.length === 1) {
                    let t = <Task>{};
                    t.id = searchResult.data[0].items[0].id;
                    t.title = searchResult.data[0].items[0].name;

                    session.dialogData.task = t;
                    next();
                    return;
                }

                session.dialogData.options = searchResult.data;
                let options = [];
                for (let d of searchResult.data) {
                    for (let i of d.items) {
                        options[options.length] = `${i.id} - ${i.name}`;
                    }
                }
                options[options.length] = this.OptionCancel;

                builder.Prompts.choice(session, "Foram encontrados vários registros, qual devo consultar?", options,
                    { listStyle: builder.ListStyle.list });

            },
            async (session, results, next) => {
                if (results.response) {
                    if (results.response.entity === this.OptionCancel) {
                        session.send("Ok! depois tentamos novamente...");
                        session.clearDialogStack();
                        return;
                    }

                    const choice: string[] = results.response.entity.split(" - ");
                    let task = <Task>{};
                    task.id = parseInt(choice.shift(), 10);
                    task.title = choice.join(" - ");
                    session.dialogData.task = task;
                }

                let targets = <builder.IEntity[]>session.dialogData.targets;

                session.sendTyping();
                if (UtilsService.has_at_least_one(this.TargetsRegExp.description, targets)) {
                    this.getTaskDescriptions(session);
                    return;
                }

                if (UtilsService.has_at_least_one(this.TargetsRegExp.evidences, targets)) {
                    this.getTaskEvidences(session);
                    return;
                }

                if (UtilsService.has_at_least_one(this.TargetsRegExp.activities, targets)) {
                    this.getTaskActivities(session);
                    return;
                }

                this.getTaskComplexities(session);
            },
        ]);
    }

    private async getTaskComplexities(session: builder.Session): Promise<void> {
        const [err, task] = await to(IteratorService.getTaskComplexities(
            session.userData.user, session.dialogData.task));

        if (err || !task.success) {
            session.endDialog(`Ocorreu o seguinte erro ao obter as complexidades: ${(err || task).message}`);
            return;
        }

        session.send(`Complexidades da tarefa *"${task.data.id} - ${task.data.title}"*: \n\n` +
            `* **Estimada:** ${task.data.complexity}; \n\n` +
            `* **Realizada:** ${task.data.complexityDone};`);
    }

    private async getTaskEvidences(session: builder.Session): Promise<void> {
        const [err, task] = await to(IteratorService.getTaskEvidences(
            session.userData.user, session.dialogData.task));

        if (err || !task.success) {
            session.endDialog(`Ocorreu o seguinte erro ao obter os anexos: ${(err || task).message}`);
            return;
        }

        if (task.data.evidences.length === 0) {
            session.endDialog(`Nenhum anexo encontrado na tarefa *"${task.data.id} - ${task.data.title}"* `);
            return;
        }

        const evidences = task.data.evidences.map((e) => {
            return `* ${e};`;
        }).join("\n\n");

        session.send(`Anexos à tarefa *"${task.data.id} - ${task.data.title}":* \n\n` + evidences);
    }

    private async getTaskDescriptions(session: builder.Session): Promise<void> {
        const [err, task] = await to(IteratorService.getTaskDescriptions(
            session.userData.user, session.dialogData.task));

        if (err || !task.success) {
            session.endDialog(`Ocorreu o seguinte erro ao obter as descrições: ${(err || task).message}`);
            return;
        }

        if (task.data.description.length === 0) {
            session.endDialog(`Nenhuma descrição encontrada para a tarefa *"${task.data.id} - ${task.data.title}"* `);
            return;
        }

        const descriptions = task.data.description.map((d) => {
            return `* ${d};`;
        }).join("\n\n");

        session.send(`Descrições da tarefa "${task.data.id} - ${task.data.title}": \n\n` + descriptions);
    }

    private async getTaskActivities(session: builder.Session): Promise<void> {
        const [err, task] = await to(IteratorService.getTaskActivities(
            session.userData.user, session.dialogData.task));

        if (err || !task.success) {
            session.endDialog(`Ocorreu o seguinte erro ao obter as atividades: ${(err || task).message}`);
            return;
        }

        if (task.data.activities.length === 0) {
            session.endDialog(`Nenhuma atividade encontrada na tarefa *"${task.data.id} - ${task.data.title}"*`);
            return;
        }

        const activities = task.data.activities.map((a) => {
            return `* ${a.id} - ${a.title} *(${a.complexity} - ${a.userName})*;`;
        }).join("\n\n");

        session.send(`Atividades da tarefa *"${task.data.id} - ${task.data.title}"*: \n\n` + activities);
    }
}
