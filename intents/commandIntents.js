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
const constants_1 = require("../domain/constants");
const iteratorBaseRepository_1 = require("../domain/repositories/iteratorBaseRepository");
const sqlParameter_1 = require("../domain/sqlParameter");
// import { UtilsService, FormattingOptions } from "../domain/services/utilsService";
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
class CommandIntents {
    constructor() {
        this.CommandList = {
            flipCoin: /^jogar moeda/,
            help: /^(help|ajuda)/,
            login: /^logar/,
            relogin: /^relogar/,
            updateBTTracking: /^atualizar acompanhamento/,
        };
    }
    setup(dialog) {
        dialog.matches("commands", [
            (session, args, next) => {
                const receivedCommand = builder.EntityRecognizer.findEntity(args.entities, "command_or_target");
                if (!receivedCommand || !receivedCommand.entity) {
                    session.endDialog("Descupe, não entendi o que você disse...");
                    return;
                }
                if (this.CommandList.updateBTTracking.test(receivedCommand.entity)) {
                    this.updateTracking(session);
                    return;
                }
                if (this.CommandList.login.test(receivedCommand.entity)
                    || this.CommandList.relogin.test(receivedCommand.entity)) {
                    this.login(session);
                    return;
                }
                if (this.CommandList.help.test(receivedCommand.entity)) {
                    session.beginDialog("/help");
                    return;
                }
                if (this.CommandList.flipCoin.test(receivedCommand.entity)) {
                    session.beginDialog("/flipCoin");
                    return;
                }
                session.endDialog(`Desculpe, ainda não posso executar o comando ${receivedCommand.entity}`);
            },
        ]);
    }
    login(session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.userData = {};
            session.beginDialog("/profile");
        });
    }
    updateTracking(session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.send("Esse é um pouco lento, peraí... ");
            session.sendTyping();
            const result = yield IR.executeSPNoResult("FillFutureWorkDaysSlots", sqlParameter_1.SQLParameter.Int("billingCenterId", constants_1.Constants.BillingCenterBT));
            if (!result.success) {
                session.endDialog(`Ops! aconteceu algum erro: ${result.message || "Não definido"}`);
            }
            else {
                session.endDialog(`Ok! acompanhamento atualizado!`);
            }
        });
    }
}
exports.CommandIntents = CommandIntents;
//# sourceMappingURL=commandIntents.js.map