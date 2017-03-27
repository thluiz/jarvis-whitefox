import to  from "await-to-js";
import * as builder from "botbuilder";
import { IteratorService } from "../domain/services/service";
import { UtilsService } from "../domain/services/utilsService";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";

const IE = new IntentEntities();

export class QueryIntents extends IntentBase {
    private Locations = {
        activity: /^(atividade|lançamento)/,
        all: /^(tudo|tod(o|a))/,
        backlog: /^(backlog|(n|d)o\ backlog|(tarefa(s)?|ite(ns|m))\ (d|n)o\ backlog)/,
        closedIncident: /^((chamado(s)?)\ fechado)/,
        closedTasks: /^(tarefa(s)?(\ fechada| conclu(í|i)da))/,
        monitoring: /^(acompanhamento|andamento)/,
        openIncident: /^((chamado(s)?(\ aberto)?)|incidente)/,
        openTasks: /^(tarefa(s)?(\ aberta)?)/,
    };

    private Restrictions = {
        bt: /^(bt|b\&t|b\ \&\ t|bet)/,
        own: /^(meu|minha)/,
        poliedro: /^(poliedro)/,
        projects: /^(procam|classon|edros|portal|p\+|p\ \+)/,
    };

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

                let bt: boolean = this.has_at_least_one(this.Restrictions.bt, projectOrBCs);
                let poliedro: boolean = this.has_at_least_one(this.Restrictions.poliedro, projectOrBCs);

                let projects: string[] = this.extract_projects(projectOrBCs);
                let billingCenters = this.setup_billing_centers(bt, poliedro);

                session.sendTyping();
                const [ err, results ] = await to(IteratorService.Search(session.userData.user, false, projects,
                                                    this.setup_billing_centers(bt, poliedro),
                                                    this.setup_locations(locations),
                                                    text.map((t) => { return t.entity; }).join(" ")));

                if (err || !results.success) {
                    session.endDialog(`Ocorreu o seguinte erro: ${results.message || err.message}`);
                    return;
                }

                if (!results.data) {
                    session.send("Nenhum registro encontrado!");
                    return;
                }

                let total = 0;
                let response = "";
                for (let d of results.data) {
                    response += this.getLocationTitle(d.type) + ": \n\n";
                    for (let i of d.items) {
                        response += ` * ${i.id} - ${i.name} \n\n`;
                        total++;
                    }
                }

                session.send(this.get_response_text(total) + response);
            },
        ]);
    }

    private getLocationTitle(type) {
        switch (type) {
            case "openTask":
                return "Tarefas Abertas";
            case "openTask":
                return "Tarefas Abertas";
            case "closedTask":
                return "Tarefas Fechadas";
            case "backlog":
                return "Backlog";
            case "openIncident":
                return "Chamados Abertos";
            case "closedIncident":
                return "Chamados Fechados";
            default:
                return "";
        }
    }

    private extract_projects(restrictions) {
        let r = restrictions.filter((e) => {
            return this.Restrictions.projects.test(e.entity);
        }).map((e) => {
            if (/^p\ \+|p\+/.test(e.entity)) {
                return "p+ (sites e apis)";
            } else {
                return e.entity;
            }
        });

        return r;
    }

    private setup_locations(locations: builder.IEntity[]): string[] {
        let list = [];

        if (this.has_at_least_one(this.Locations.all, locations)) {
            list.push("openTask", "closedTask", "backlog", "openincident", "closedincident");
            return list;
        }

        if (this.has_at_least_one(this.Locations.closedTasks, locations)) {
            locations = this.remove_all(this.Locations.closedTasks, locations);
            list.push("closedTask");
        }

        if (this.has_at_least_one(this.Locations.backlog, locations)) {
            locations = this.remove_all(this.Locations.backlog, locations);
            list.push("backlog");
        }

        if (this.has_at_least_one(this.Locations.openTasks, locations)) {
            locations = this.remove_all(this.Locations.openTasks, locations);
            list.push("openTask");
        }

        if (this.has_at_least_one(this.Locations.closedIncident, locations)) {
            list.push("closedincident");
        }

        if (this.has_at_least_one(this.Locations.openIncident, locations)) {
            locations = this.remove_all(this.Locations.openIncident, locations);
            list.push("openincident");
        }

        if (this.has_at_least_one(this.Locations.activity, locations)) {
            list.push("activity");
        }

        return list;
    }

    private setup_billing_centers(bt: boolean, poliedro: boolean): string[] {
        let billingCenters = [];
        if (bt) {
            billingCenters.push("B&T Corretora");
        }

        if (poliedro) {
            billingCenters.push("poliedro");
        }

        return billingCenters;
    }

    private remove_all(regexp: RegExp, entities: builder.IEntity[]): builder.IEntity[] {
        let resp: builder.IEntity[] = [];

        entities.forEach((e) => {
            if (!regexp.test(e.entity)) {
                resp.push(e);
            }
        });

        return resp;
    }

    private has_at_least_one(regexp: RegExp, entities: builder.IEntity[]): boolean {
        for (let e of entities) {
            if (regexp.test(e.entity)) {
                return true;
            }
        }

        return false;
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
