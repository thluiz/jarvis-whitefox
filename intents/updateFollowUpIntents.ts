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

export class UpdateFollowupIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("update_followup", [
            async (session, args, next) => {
                session.send("Esse é um pouco lento, peraí... ");
                session.sendTyping();
                const [err, result] = await to(IR.executeSPNoResult("FillFutureWorkDaysSlots",
                    SQLParameter.Int("billingCenterId", Constants.BillingCenterBT)));

                if (err || !result.success) {
                    session.endDialog(`Ops! aconteceu algum erro: ${(err || result).message || "Não definido"}`);
                } else {
                    session.endDialog(`Ok! acompanhamento atualizado!`);
                }
            },
        ]);
    }
}
