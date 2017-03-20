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
const service_1 = require("../domain/services/service");
const funnyMessages_1 = require("../domain/services/templates/funnyMessages");
const sqlParameter_1 = require("../domain/sqlParameter");
const intentBase_1 = require("./intentBase");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
class GeneralIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.CommandList = {
            debug: /^debug/,
            flipCoin: /^jogar moeda/,
            login: /^(relogar|logar)/,
            logout: /^(logout|sair)/,
            updateBTTracking: /^atualizar acompanhamento/,
            updateIncidents: /^atualizar incidentes/,
        };
        this.SmallTalk = {
            greetings: /^(bom\ (dia|crep|domin|fi)|boa\ (tarde|noite)|saudaç)/,
            hello: /^(oi|hei|hey|e\ aí|hello|ai|aí|blz|hello|acorda|opa|hola|olá|ola)/,
            howAreYou: /^(como\ vai|blzinha|blz\?|tudo\ bem|tudo\ tranq)/,
            thanks: /^(ok|obrigad|brigad|muito\ obrigad|grat|agradecid|muito agradec|tks|thank|vlw|valeu|um\ prazer)/,
        };
    }
    setup(dialog) {
        dialog.matches("None", [
            (session, args, next) => {
                const receivedCommand = builder.EntityRecognizer.findEntity(args.entities, "command_or_target");
                const receivedText = builder.EntityRecognizer.findEntity(args.entities, "text");
                if (!receivedCommand || !receivedCommand.entity) {
                    if (receivedText && receivedText.entity && receivedText.entity.length > 0) {
                        const responded = this.respondToSmallTalk(session, receivedText.entity);
                        if (responded) {
                            return;
                        }
                    }
                    this.saveUserError(session, {
                        date: new Date(),
                        error: "GeneralIntents",
                    });
                    const msg = session.userData.errors.length < 3 ?
                        "Descupe, não entendi o que você disse..."
                        : `Parece que não estamos nos entendendo..\n\n Você pode digitar [help], [ajuda], um 'poderia me ajudar?' também funciona. Se a coisa estiver feia, pode pedir penico também que te atendo...`;
                    session.endDialog(msg);
                    return;
                }
                if (this.CommandList.updateBTTracking.test(receivedCommand.entity)) {
                    this.updateTracking(session);
                    return;
                }
                if (this.CommandList.login.test(receivedCommand.entity)) {
                    this.login(session);
                    return;
                }
                if (this.CommandList.flipCoin.test(receivedCommand.entity)) {
                    session.beginDialog("/flipCoin");
                    return;
                }
                if (this.CommandList.updateIncidents.test(receivedCommand.entity)) {
                    this.updateIncidents(session);
                    return;
                }
                if (this.CommandList.debug.test(receivedCommand.entity)) {
                    session.endDialog(JSON.stringify(session.userData));
                    return;
                }
                if (this.CommandList.logout.test(receivedCommand.entity)) {
                    session.beginDialog("/logOut");
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
    updateIncidents(session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.send("Esse pode ser um pouco lento, mas já estou executando... ");
            session.sendTyping();
            const result = yield service_1.IteratorService.updateIncidents();
            if (!result.success) {
                session.endDialog(`Ops! aconteceu algum erro: ${result.message || "Não definido"}`);
            }
            else {
                session.endDialog(`Ok! chamados atualizados no iterator!`);
            }
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
    respondToSmallTalk(session, text) {
        let responded = false;
        if (this.SmallTalk.greetings.test(text)) {
            session.endDialog(funnyMessages_1.FunnyMessages.greetingsResponse());
            return true;
        }
        if (this.SmallTalk.howAreYou.test(text)) {
            session.endDialog(funnyMessages_1.FunnyMessages.howAreYouResponse());
            return true;
        }
        if (this.SmallTalk.thanks.test(text)) {
            session.endDialog(funnyMessages_1.FunnyMessages.thankYouResponse());
            return true;
        }
        if (this.SmallTalk.hello.test(text)) {
            session.endDialog(funnyMessages_1.FunnyMessages.helloResponse());
            return true;
        }
        return responded;
    }
}
exports.GeneralIntents = GeneralIntents;
//# sourceMappingURL=generalIntents.js.map