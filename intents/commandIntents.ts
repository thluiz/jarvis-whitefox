import * as builder from "botbuilder";
import { Constants } from "../domain/constants";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { SQLParameter } from "../domain/sqlParameter";
import { IIntentBase } from "./intentBase";

// import { UtilsService, FormattingOptions } from "../domain/services/utilsService";

const IR = new IteratorBaseRepository();

export class CommandIntents implements IIntentBase {

    private CommandList = {
        flipCoin: /^jogar moeda/,
        help: /^(help|ajuda)/,
        login: /^logar/,
        relogin: /^relogar/,
        updateBTTracking: /^atualizar acompanhamento/,
    };

    public setup(dialog: builder.IntentDialog): void {
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

    private async login(session: builder.Session): Promise<any> {
        session.userData = {};
        session.beginDialog("/profile");

    }

    private async updateTracking(session: builder.Session): Promise<any> {
        session.send("Esse é um pouco lento, peraí... ");
        session.sendTyping();
        const result = await IR.executeSPNoResult("FillFutureWorkDaysSlots",
            SQLParameter.Int("billingCenterId", Constants.BillingCenterBT));

        if (!result.success) {
            session.endDialog(`Ops! aconteceu algum erro: ${result.message || "Não definido"}`);
        } else {
            session.endDialog(`Ok! acompanhamento atualizado!`);
        }
    }
}
