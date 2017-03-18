import * as builder from "botbuilder";
import { ItembacklogRepository } from "../domain/repositories/itemBacklogRepository";
import { IteratorService } from "../domain/services/iteratorService";
import { SecurityService } from "../domain/services/securityService";
import { UtilsService } from "../domain/services/utilsService";
import { IntentBuilder } from "./intents";
import { Result } from "./Result";


class DialogBuilder {
    private bot: builder.UniversalBot;

    constructor(connector) {
        const self: DialogBuilder = this;

        this.bot = new builder.UniversalBot(connector);
        const intentBuilder = new IntentBuilder();

        this.bot.dialog("/searchItembacklog", [
            function (session: builder.Session, results: any, next: Function) {
                builder.Prompts.text(session, "Poderia informar parte do nome da tarefa?");
            },
            async function (session: builder.Session, results: any) {
                const title: string = results.response;
                const maxItens: number = 5;
                const titleMinLength: number = 5;

                if (title.length >= titleMinLength) {
                    session.sendTyping();
                    let result = await IteratorService.SearchItemBackLog(
                        session.userData.user, title, maxItens
                    );

                    if (!result.success) {
                        session.endDialog(`Ops! aconteceu o erro ${result.message}`);
                        return;
                    }
                    const data = result.data;
                    if (data.items.length < data.totalCount) {
                        session.send(`Hum... encontrei ${data.totalCount} registros, mas não tem problema.`);
                        session.send(`Aqui vão os ${maxItens} mais recentes:`);
                    }
                    let list: string = "";
                    data.items.forEach(el => {
                        list += (`  ${el.id} - ${el.name} \n\n`);
                    });

                    session.send(list);
                    session.endDialog();
                } else {
                    session.send(`Assim você vai me dar muito trabalho, informe ao menos ${titleMinLength} caracteres para eu procurar.`);
                    session.replaceDialog("/searchItembacklog");
                }
            }]
        );

        this.bot.dialog("/askItemBacklog", [
            function (session: builder.Session, args: any, next: Function) {
                builder.Prompts.number(session, !args.notFound ?
                    `Em qual tarefa devo lançar${!args.retry ? "" : " então"}?`
                    : "Não encontrei esse item, poderia confirmar?");
            },
            async function (session: builder.Session, results: any, next: Function) {
                const IR: ItembacklogRepository = new ItembacklogRepository();
                const itemBacklogDetails = await IR.load(results.response);

                if (!itemBacklogDetails.success) {
                    session.send(`Ops! não encontrei esse item. Recebi a mensagem "${itemBacklogDetails.message}"`);
                    session.endDialog();
                }

                const itemBacklog = itemBacklogDetails.data;
                if (!itemBacklog) {
                    session.replaceDialog("/askItemBacklog", { notFound: true });
                    return;
                }

                session.dialogData.itemBacklog = itemBacklog;
                builder.Prompts.choice(session, "Confirma que é esse item?", "sim|não", { listStyle: builder.ListStyle.none });
            }, function (session: builder.Session, results: any, next: Function) {
                if (results.response.entity === "não") {
                    session.dialogData.itemBacklog = undefined;
                    session.replaceDialog("/askItemBacklog", { retry: true });
                    return;
                }

                if (next) {
                    next();
                }
            }
        ]);

        this.bot.dialog("/createActivity", [
            function (session: builder.Session, args: any, next: Function) {
                builder.Prompts.text(session, !args.smallTitle ?
                    "O que você fez?"
                    : "vamos lá! eu sei que você descrever melhor seu trabalho... ");
            },
            function (session: builder.Session, results: any, next: Function) {
                session.dialogData.title = results.response;
                if (session.dialogData.title.length < 3) {
                    session.replaceDialog("/createActivity", { smallTitle: true });
                    return;
                }

                session.beginDialog("/askItemBacklog");
            }, function (session: builder.Session, results: any, next: Function) {
                builder.Prompts.choice(session, "Qual a complexidade?", "0.5|1|2", { listStyle: builder.ListStyle.button });
            }, async function (session: builder.Session, results: any, next: Function) {
                session.dialogData.complexity = results.response.entity;

                session.send("Já tenho tudo que preciso, estou criando a tarefa...");
                session.sendTyping();

                const createTaskResult = await IteratorService.createTask(
                    session.userData.user,
                    session.dialogData.title,
                    session.dialogData.itemBacklog,
                    session.dialogData.complexity
                );

                if (!createTaskResult.success) {
                    session.endDialog(`Um aconteceu algum problema... a mensagem foi: ${createTaskResult}`);
                    return;
                }

                session.endDialog("Tarefa lançada!");
            }
        ]);
    }
}

export { DialogBuilder }