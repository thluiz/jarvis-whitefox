import to from "await-to-js";
import * as builder from "botbuilder";
import { Constants } from "../domain/constants";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { IteratorService } from "../domain/services/service";
import { FunnyMessages } from "../domain/services/templates/funnyMessages";
import { SQLParameter } from "../domain/sqlParameter";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IR = new IteratorBaseRepository();
const IE = new IntentEntities();

export class GeneralIntents extends IntentBase {

    private CommandList = {
        debug: /^debug/,
        flipCoin: /^(jogar\ moeda|joga\ moeda)/,
        login: /^(relogar|logar)/,
        logout: /^(logout|sair)/,
        updateBTTracking: /^atualizar acompanhamento/,
        updateIncidents: /^(atualizar\ incidentes|atualizar\ chamados)/,
    };

    private SmallTalk = {
        greetings: /^(bom\ (dia|crep|domin|fi)|boa\ (tarde|noite)|saudaç)/,
        hello: /^(oi|hei|hey|e\ aí|hello|ai|aí|blz|hello|acorda|opa|hola|olá|ola)/,
        howAreYou: /^(como\ vai|blzinha|blz\?|tudo\ bem|tudo\ tranq)/,
        thanks: /^(ok|obrigad|brigad|muito\ obrigad|grat|agradecid|muito agradec|tks|thank|vlw|valeu|um\ prazer)/,
    };

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("None", [
            (session, args, next) => {
                const receivedCommand = builder.EntityRecognizer.findEntity(args.entities, IE.Command);
                const receivedText = builder.EntityRecognizer.findEntity(args.entities, IE.Text);

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
                        // tslint:disable-next-line:max-line-length
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

    private async login(session: builder.Session): Promise<any> {
        session.userData = {};
        session.beginDialog("/profile");
    }

    private async updateIncidents(session: builder.Session): Promise<any> {
        session.send("Esse pode ser um pouco lento, mas já estou executando... ");
        session.sendTyping();
        const [err, result] = await to(IteratorService.updateIncidents());

        if (err || !result.success) {
            session.endDialog(`Ops! aconteceu algum erro: ${ (err || result).message || "Não definido"}`);
        } else {
            session.endDialog(`Ok! chamados atualizados no iterator!`);
        }
    }

    private async updateTracking(session: builder.Session): Promise<any> {
        session.send("Esse é um pouco lento, peraí... ");
        session.sendTyping();
        const [err, result] = await to(IR.executeSPNoResult("FillFutureWorkDaysSlots",
            SQLParameter.Int("billingCenterId", Constants.BillingCenterBT)));

        if (err || !result.success) {
            session.endDialog(`Ops! aconteceu algum erro: ${ (err || result).message || "Não definido"}`);
        } else {
            session.endDialog(`Ok! acompanhamento atualizado!`);
        }
    }

    private respondToSmallTalk(session: builder.Session, text): boolean {
        let responded = false;

        if (this.SmallTalk.greetings.test(text)) {
            session.endDialog(FunnyMessages.greetingsResponse());
            return true;
        }

        if (this.SmallTalk.howAreYou.test(text)) {
            session.endDialog(FunnyMessages.howAreYouResponse());
            return true;
        }

        if (this.SmallTalk.thanks.test(text)) {
            session.endDialog(FunnyMessages.thankYouResponse());
            return true;
        }

        if (this.SmallTalk.hello.test(text)) {
            session.endDialog(FunnyMessages.helloResponse());
            return true;
        }

        return responded;
    }
}
