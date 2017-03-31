import to from "await-to-js";
import * as builder from "botbuilder";
import { IteratorService } from "../domain/services/service";
import { IntentBase } from "./intentBase";

export class UpdateIncidentsIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("update_incident", [
            async (session, args, next) => {
                session.sendTyping();
                const [err, result] = await to(IteratorService.updateIncidents());

                if (err || !result.success) {
                    session.endDialog(`Ops! aconteceu algum erro: ${(err || result).message || "Não definido"}`);
                } else {
                    session.endDialog(`Ok! chamados atualizados no iterator!`);
                }
            },
        ]);
    }
}
