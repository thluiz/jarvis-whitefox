import * as builder from "botbuilder";
import { IteratorService } from "../domain/services/service";
import { IntentBase } from "./intentBase";

export class QueryIntents extends IntentBase {
    private Locations = {
        activity: /^(atividade|lançamento)/,
        backlog: /^(backlog)/,
        // tslint:disable-next-line:max-line-length
        closedIncident: /^(chamados\ fechado|chamado\ fechado)/,
        closedTasks: /^(tarefas\ fechada|tarefa\ fechada|tarefas\ concluída|tarefas\ concluida|tarefa\ concluída|tarefa\ concluida)/,
        monitoring: /^(acompanhamento|andamento)/,
        openIncident: /^(chamado|chamados\ aberto|incidente|chamado\ aberto)/,
        openTasks: /^(tarefas|tarefas\ aberta)/,
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
                if (!this.checkUserLogedIn(session, "Para realizar as consultas, preciso saber quem é você. \n\n Depois que você logar poderemos fazer as consultas, ok?")) {
                    return;
                }

                const locations = builder.EntityRecognizer.findAllEntities(args.entities, "location");
                const restrictions = builder.EntityRecognizer.findAllEntities(args.entities, "command_or_target");
                const text = builder.EntityRecognizer.findAllEntities(args.entities, "text");

                let bt: boolean = this.has_at_least_one(this.Restrictions.bt, restrictions);
                let poliedro: boolean = this.has_at_least_one(this.Restrictions.poliedro, restrictions);
                let own: boolean = this.has_at_least_one(this.Restrictions.own, restrictions);

                let projects: string[] = this.extract_projects(restrictions);

                if (this.has_at_least_one(this.Locations.monitoring, locations)) {
                    session.endDialog("Em breve poderei listar os acompanhamentos...");
                    return;
                }

                let billingCenters = this.setup_billing_centers(bt, poliedro);

                session.sendTyping();
                let results = await IteratorService.Search(session.userData.user, own, projects,
                    this.setup_billing_centers(bt, poliedro),
                    this.setup_locations(locations),
                    text.map((t) => { return t.entity; }).join(" "));

                if (!results.success) {
                    session.endDialog(`Ocorreu o seguinte erro: ${results.message}`);
                    return;
                }
                if (!results.data) {
                    session.send("Nenhum registro encontrado!");
                    return;
                }

                let msg = "Os seguintes resultados foram encontrados: \n\n";

                for (let d of results.data) {
                    msg += this.getLocationTitle(d.type) + ": \n\n";
                    for (let i of d.items) {
                        msg += ` * ${i.id} - ${i.name} \n\n`;
                    }
                }

                session.send(msg);
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
                return "Chamados Abertos:";
            case "closedIncident":
                return "Chamados Fechados:";
            default:
                return "";
        }
    }

    private extract_projects(restrictions) {
        let r = restrictions.filter((e) => {
            return this.Restrictions.projects.test(e.entity);
        }).map((e) => {
            if (/^p\ \+|p\+/.test(e)) {
                return "p+ (sites e apis)";
            } else {
                return e.entity;
            }
        });

        return r;
    }

    private setup_locations(locations: builder.IEntity[]): string[] {
        let list = [];

        if (this.has_at_least_one(this.Locations.openTasks, locations)) {
            list.push("openTask");
        }

        if (this.has_at_least_one(this.Locations.closedTasks, locations)) {
            list.push("closedTask");
        }

        if (this.has_at_least_one(this.Locations.backlog, locations)) {
            list.push("backlog");
        }

        if (this.has_at_least_one(this.Locations.openIncident, locations)) {
            list.push("openincident");
        }

        if (this.has_at_least_one(this.Locations.closedIncident, locations)) {
            list.push("closedincident");
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
}
