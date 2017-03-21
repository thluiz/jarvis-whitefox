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
const utilsService_1 = require("../domain/services/utilsService");
const intentBase_1 = require("./intentBase");
class QueryIntents extends intentBase_1.IntentBase {
    constructor() {
        super(...arguments);
        this.Locations = {
            activity: /^(atividade|lançamento)/,
            all: /^(tudo|tod(o|a))/,
            backlog: /^(backlog|(n|d)o\ backlog|(tarefa(s)?|ite(ns|m))\ (d|n)o\ backlog)/,
            closedIncident: /^((chamado(s)?)\ fechado)/,
            closedTasks: /^(tarefa(s)?(\ fechada| conclu(í|i)da))/,
            monitoring: /^(acompanhamento|andamento)/,
            openIncident: /^((chamado(s)?(\ aberto)?)|incidente)/,
            openTasks: /^(tarefa(s)?(\ aberta)?)/,
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
                if (!this.checkUserLogedIn(session, "Para realizar as consultas, preciso saber quem é você, ok? ")) {
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
                return "Chamados Abertos";
            case "closedIncident":
                return "Chamados Fechados";
            default:
                return "";
        }
    }
    extract_projects(restrictions) {
        let r = restrictions.filter((e) => {
            return this.Restrictions.projects.test(e.entity);
        }).map((e) => {
            if (/^p\ \+|p\+/.test(e.entity)) {
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
    get_response_text(total) {
        let formal = ["Encontrei os seguintes registros:",
            "Foram encontrados esses itens: "];
        let funny = this.get_response_list(total);
        return utilsService_1.UtilsService.getRandomItemFromArray(formal.concat(formal, funny)) + "\n\n";
    }
    get_response_list(total) {
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
exports.QueryIntents = QueryIntents;
//# sourceMappingURL=queryIntents.js.map