import to  from "await-to-js";
import * as builder from "botbuilder";
import { IteratorService } from "../domain/services/service";
import { UtilsService } from "../domain/services/utilsService";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class QueryIntents extends IntentBase {

    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("query", [
            async (session, args, next) => {

                // tslint:disable-next-line:max-line-length
                if (!this.checkUserLogedIn(session, "Para realizar as consultas, preciso saber quem é você, ok? ")) {
                    return;
                }

                const locations = builder.EntityRecognizer.findAllEntities(args.entities, IE.Location);
                const projectOrBCs = builder.EntityRecognizer.findAllEntities(args.entities, IE.ProjectBillingCenter);
                const restrictions = builder.EntityRecognizer.findAllEntities(args.entities, IE.Target);
                const text = builder.EntityRecognizer.findAllEntities(args.entities, IE.Text);

                let bt = UtilsService.has_billingcenter_bt(projectOrBCs);
                let poliedro = UtilsService.has_billingcenter_poliedro(projectOrBCs);
                let projects = UtilsService.extract_projects(projectOrBCs);

                session.sendTyping();
                const [ err, results ] = await to(IteratorService.search(session.userData.user, false, projects,
                                                    UtilsService.setup_billing_centers(bt, poliedro),
                                                    UtilsService.setup_locations(locations),
                                                    text.map((t) => { return t.entity; }).join(" ")));

                if (err || !results.success) {
                    session.endDialog(`Ocorreu o seguinte erro: ${ (results || err).message}`);
                    return;
                }

                if (!results.data) {
                    session.send("Nenhum registro encontrado!");
                    return;
                }

                let total = 0;
                let response = "";
                for (let d of results.data) {
                    response += UtilsService.getLocationTitle(d.type) + ": \n\n";
                    for (let i of d.items) {
                        response += ` * ${i.id} - ${i.name} \n\n`;
                        total++;
                    }
                }

                session.send(this.get_response_text(total) + response);
            },
        ]);
    }

    private get_response_text(total: number): string {
        let formal = ["Encontrei os seguintes registros:",
        "Foram encontrados esses itens: "];

        let funny = this.get_response_list(total);

        return UtilsService.getRandomItemFromArray<string>(formal.concat(formal, funny)) + "\n\n";
    }

    private get_response_list(total: number): string[] {
        if (total > 30) {
            return [
                "Ufa! o dia inteiro para listar tudo isso...",
                "Achei que não ia terminhar nunca, mas aí vai...",
                "Que trabalheira que você me deu...",
            ];
        }

        if (total > 15) {
            return [
                "Deu para aquecer com essa lista, manda mais! segue o que vc pediu:",
                "Íííssaaa! saúde é o que interessa! e não tem lista como essa (foi boa, não?): ",
                "1, 2, 3, 4 - listar itens é um barato! segue o que você pediu: ",
            ];
        }

        return [
            "Moleza! segue aí: ",
            "Nem deu para suar, olha os registros:",
            "1, 2, 3, 4 - listar itens é um barato! 4, 3, 2, 1... segue o que você pediu! hum não rimou, mas segue: ",
        ];
    }
}
