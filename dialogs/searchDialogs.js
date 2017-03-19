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
const service_1 = require("../domain/services/service");
class SaearchDialogs {
    setup(bot) {
        bot.dialog("/searchItembacklog", [
            (session, results, next) => {
                builder.Prompts.text(session, "Poderia informar parte do nome da tarefa?");
            },
            (session, results) => __awaiter(this, void 0, void 0, function* () {
                const title = results.response;
                const maxItens = 5;
                const titleMinLength = 5;
                if (title.length >= titleMinLength) {
                    session.sendTyping();
                    let result = yield service_1.IteratorService.SearchItemBackLog(session.userData.user, title, maxItens);
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
                    // tslint:disable-next-line:max-line-length
                    session.send(`Assim você vai me dar muito trabalho, informe ao menos ${titleMinLength} caracteres para eu procurar.`);
                    session.replaceDialog("/searchItembacklog");
                }
            })
        ]);
    }
}
exports.SaearchDialogs = SaearchDialogs;
//# sourceMappingURL=searchDialogs.js.map