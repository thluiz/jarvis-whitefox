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
const intentBase_1 = require("./intentBase");
class QueryIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.Locations = {
            activity: /^(atividade|lançamento)/,
            backlog: /^(backlog)/,
            // tslint:disable-next-line:max-line-length
            closedIncident: /^(chamados\ fechado|chamado\ fechado)/,
            closedTasks: /^(tarefas\ fechada|tarefa\ fechada|tarefas\ concluída|tarefas\ concluida|tarefa\ concluída|tarefa\ concluida)/,
            monitoring: /^(acompanhamento|andamento)/,
            openIncident: /^(chamado|chamados\ aberto|incidente|chamado\ aberto)/,
            openTasks: /^(tarefas|tarefas\ aberta)/,
        };
        this.Restrictions = {
            bt: /^(bt|b\&t|b\ \&\ t|bet)/,
            own: /^(meu|minha)/,
            poliedro: /^(poliedro)/,
            projects: /^(procam|classon|edros|portal|p\+|p\ \+)/,
        };
    }
    setup(dialog) {
        dialog.matches("query", [
            (session, args, next) => __awaiter(this, void 0, void 0, function* () {
                // tslint:disable-next-line:max-line-length
                if (!this.checkUserLogedIn(session, "Para realizar as consultas, preciso saber quem é você. \n\n Depois que você logar poderemos fazer as consultas, ok?")) {
                    return;
                }
                const locations = builder.EntityRecognizer.findAllEntities(args.entities, "location");
                const restrictions = builder.EntityRecognizer.findAllEntities(args.entities, "command_or_target");
                const text = builder.EntityRecognizer.findAllEntities(args.entities, "text");
                let bt = this.has_at_least_one(this.Restrictions.bt, restrictions);
                let poliedro = this.has_at_least_one(this.Restrictions.poliedro, restrictions);
                let own = this.has_at_least_one(this.Restrictions.own, restrictions);
                let projects = this.extract_projects(restrictions);
                if (this.has_at_least_one(this.Locations.monitoring, locations)) {
                    session.endDialog("Em breve poderei listar os acompanhamentos...");
                    return;
                }
                let billingCenters = this.setup_billing_centers(bt, poliedro);
                session.sendTyping();
                let results = yield service_1.IteratorService.Search(session.userData.user, own, projects, this.setup_billing_centers(bt, poliedro), this.setup_locations(locations), text.map((t) => { return t.entity; }).join(" "));
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
            }),
        ]);
    }
    getLocationTitle(type) {
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
    extract_projects(restrictions) {
        let r = restrictions.filter((e) => {
            return this.Restrictions.projects.test(e.entity);
        }).map((e) => {
            if (/^p\ \+|p\+/.test(e)) {
                return "p+ (sites e apis)";
            }
            else {
                return e.entity;
            }
        });
        return r;
    }
    setup_locations(locations) {
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
    setup_billing_centers(bt, poliedro) {
        let billingCenters = [];
        if (bt) {
            billingCenters.push("B&T Corretora");
        }
        if (poliedro) {
            billingCenters.push("poliedro");
        }
        return billingCenters;
    }
    remove_all(regexp, entities) {
        let resp = [];
        entities.forEach((e) => {
            if (!regexp.test(e.entity)) {
                resp.push(e);
            }
        });
        return resp;
    }
    has_at_least_one(regexp, entities) {
        for (let e of entities) {
            if (regexp.test(e.entity)) {
                return true;
            }
        }
        return false;
    }
}
exports.QueryIntents = QueryIntents;
//# sourceMappingURL=queryIntents.js.map