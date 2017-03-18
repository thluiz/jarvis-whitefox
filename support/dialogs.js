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
const iteratorService_1 = require("../domain/services/iteratorService");
const intents_1 = require("./intents");
class DialogBuilder {
    constructor(connector) {
        const self = this;
        this.bot = new builder.UniversalBot(connector);
        const intentBuilder = new intents_1.IntentBuilder();
        this.bot.dialog("/searchItembacklog", [
            function (session, results, next) {
                builder.Prompts.text(session, "Poderia informar parte do nome da tarefa?");
            },
            function (session, results) {
                return __awaiter(this, void 0, void 0, function* () {
                    const title = results.response;
                    const maxItens = 5;
                    const titleMinLength = 5;
                    if (title.length >= titleMinLength) {
                        session.sendTyping();
                        let result = yield iteratorService_1.IteratorService.SearchItemBackLog(session.userData.user, title, maxItens);
                        if (!result.success) {
                            session.endDialog(`Ops! aconteceu o erro ${result.message}`);
                            return;
                        }
                        const data = result.data;
                        if (data.items.length < data.totalCount) {
                            session.send(`Hum... encontrei ${data.totalCount} registros, mas não tem problema.`);
                            session.send(`Aqui vão os ${maxItens} mais recentes:`);
                        }
                        let list = "";
                        data.items.forEach(el => {
                            list += (`  ${el.id} - ${el.name} \n\n`);
                        });
                        session.send(list);
                        session.endDialog();
                    }
                    else {
                        session.send(`Assim você vai me dar muito trabalho, informe ao menos ${titleMinLength} caracteres para eu procurar.`);
                        session.replaceDialog("/searchItembacklog");
                    }
                });
            }
        ]);
        this.bot.dialog("/askItemBacklog", [
            function (session, args, next) {
                builder.Prompts.number(session, !args.notFound ?
                    `Em qual tarefa devo lançar${!args.retry ? "" : " então"}?`
                    : "Não encontrei esse item, poderia confirmar?");
            },
            function (session, results, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    const IR = new itemBacklogRepository_1.ItembacklogRepository();
                    const itemBacklogDetails = yield IR.load(results.response);
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
                });
            }, function (session, results, next) {
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
            function (session, args, next) {
                builder.Prompts.text(session, !args.smallTitle ?
                    "O que você fez?"
                    : "vamos lá! eu sei que você descrever melhor seu trabalho... ");
            },
            function (session, results, next) {
                session.dialogData.title = results.response;
                if (session.dialogData.title.length < 3) {
                    session.replaceDialog("/createActivity", { smallTitle: true });
                    return;
                }
                session.beginDialog("/askItemBacklog");
            }, function (session, results, next) {
                builder.Prompts.choice(session, "Qual a complexidade?", "0.5|1|2", { listStyle: builder.ListStyle.button });
            }, function (session, results, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    session.dialogData.complexity = results.response.entity;
                    session.send("Já tenho tudo que preciso, estou criando a tarefa...");
                    session.sendTyping();
                    const createTaskResult = yield iteratorService_1.IteratorService.createTask(session.userData.user, session.dialogData.title, session.dialogData.itemBacklog, session.dialogData.complexity);
                    if (!createTaskResult.success) {
                        session.endDialog(`Um aconteceu algum problema... a mensagem foi: ${createTaskResult}`);
                        return;
                    }
                    session.endDialog("Tarefa lançada!");
                });
            }
        ]);
    }
}
exports.DialogBuilder = DialogBuilder;
//# sourceMappingURL=dialogs.js.map