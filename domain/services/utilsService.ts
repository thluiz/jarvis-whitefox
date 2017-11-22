import * as builder from "botbuilder";
import { sprintf } from "sprintf-js";
import { IService } from "./service";
import { FunnyMessages } from "./templates/funnyMessages";

export interface IFormattingOptions {
    withDashs: boolean;
    withDots: boolean;
    withSlashs: boolean;
    withFluffy: boolean;
}

const LocationsRegExps = {
    activity: /^(atividade|lançamento)/,
    all: /^(tudo|tod(o|a))/,
    backlog: /^(backlog|(n|d)o\ backlog|(tarefa(s)?|ite(ns|m))\ (d|n)o\ backlog)/,
    closedIncident: /^((chamado(s)?)\ fechado)/,
    closedTasks: /^(tarefa(s)?(\ fechada| conclu(í|i)da))/,
    monitoring: /^(acompanhamento|andamento)/,
    openIncident: /^((chamado(s)?(\ aberto)?)|incidente)/,
    openTasks: /^(tarefa(s)?(\ aberta)?)/,
};

const ProjectsRegExp =  /^(procam|classon|edros|portal|p\+|p\ \+|pmais)/;
const PmaisRegexp = /^p\ \+|p\+|pmais/i;

const BillingCentersRegExps = {
    bt: /^(bt|b\&t|b\ \&\ t|bet)/,
    poliedro: /^(poliedro)/,
};

export class UtilsService implements IService {

    public static extract_projects(restrictions: builder.IEntity[]): string[] {
        let r = restrictions.filter((e) => {
            return ProjectsRegExp.test(e.entity);
        }).map((e) => {
            if (PmaisRegexp.test(e.entity)) {
                return "p+ (sites e apis)";
            } else {
                return e.entity;
            }
        });

        return r;
    }

    public static has_billingcenter_bt(entities: builder.IEntity[]): boolean {
        return UtilsService.has_at_least_one(BillingCentersRegExps.bt, entities);
    }

    public static has_billingcenter_poliedro(entities: builder.IEntity[]): boolean {
        return UtilsService.has_at_least_one(BillingCentersRegExps.poliedro, entities);
    }

    public static randomNumber(n): number {
        return Math.round(Math.random() * n);
    }

    public static randomString(length = 13): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    public static getLocationTitle(type) {
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

    public static setup_locations(locations: builder.IEntity[]): string[] {
        let list = [];

        if (!locations || locations.length === 0) {
            return ["openTask"];
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.all, locations)) {
            list.push("openTask", "closedTask", "backlog", "openincident", "closedincident");
            return list;
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.closedTasks, locations)) {
            locations = UtilsService.remove_all(LocationsRegExps.closedTasks, locations);
            list.push("closedTask");
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.backlog, locations)) {
            locations = UtilsService.remove_all(LocationsRegExps.backlog, locations);
            list.push("backlog");
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.openTasks, locations)) {
            locations = UtilsService.remove_all(LocationsRegExps.openTasks, locations);
            list.push("openTask");
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.closedIncident, locations)) {
            list.push("closedincident");
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.openIncident, locations)) {
            locations = UtilsService.remove_all(LocationsRegExps.openIncident, locations);
            list.push("openincident");
        }

        if (UtilsService.has_at_least_one(LocationsRegExps.activity, locations)) {
            list.push("activity");
        }

        return list;
    }

    // tslint:disable-next-line:max-line-length
    public static generateCNPJ(formatting: IFormattingOptions = { withDashs: true, withSlashs: true, withDots: true, withFluffy: false }): string {
        let n = 9;
        let n1 = this.randomNumber(n);
        let n2 = this.randomNumber(n);
        let n3 = this.randomNumber(n);
        let n4 = this.randomNumber(n);
        let n5 = this.randomNumber(n);
        let n6 = this.randomNumber(n);
        let n7 = this.randomNumber(n);
        let n8 = this.randomNumber(n);
        let n9 = 0;
        let n10 = 0;
        let n11 = 0;
        let n12 = 1;

        // tslint:disable-next-line:max-line-length
        let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) { d1 = 0; }

        let d2 = d1 * 2 + n12 * 3 + n11 * 4
            + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2
            + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) { d2 = 0; }
        const dots: string = formatting.withDots ? "." : "";
        const dashs: string = formatting.withDashs ? "-" : "";
        const slashs: string = formatting.withSlashs ? "/" : "";
        const fluffy = formatting.withFluffy ? "(L)(F):)(F)(L)" : "";

        // tslint:disable-next-line:max-line-length
        return "" + n1 + n2 + dots + n3 + n4 + n5 + dots + n6 + n7 + n8 + slashs + n9 + n10 + n11 + n12 + dashs + d1 + d2 + fluffy;
    }

    // tslint:disable-next-line:max-line-length
    public static generateCPF(formatting: IFormattingOptions = { withDashs: true, withSlashs: true, withDots: true, withFluffy: false }): string {
        let n = 9;
        let n1 = this.randomNumber(n);
        let n2 = this.randomNumber(n);
        let n3 = this.randomNumber(n);
        let n4 = this.randomNumber(n);
        let n5 = this.randomNumber(n);
        let n6 = this.randomNumber(n);
        let n7 = this.randomNumber(n);
        let n8 = this.randomNumber(n);
        let n9 = this.randomNumber(n);
        let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) { d1 = 0; }
        let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) { d2 = 0; }
        const dots = formatting.withDots ? "." : "";
        const dashs = formatting.withDashs ? "-" : "";
        const fluffy = formatting.withFluffy ? " (flower) (hearteyes) (flower) " : "";

        return "" + fluffy + n1 + n2 + n3 + dots + n4 + n5 + n6 + dots + n7 + n8 + n9 + dashs + d1 + d2;
    }

    public static funnyResultMessage(objectName: string, result: string): string {
        return sprintf(FunnyMessages.randomKeyValueMessage(), objectName, result);
    }

    public static getRandomItemFromArray<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    public static setup_billing_centers(bt: boolean, poliedro: boolean): string[] {
        let billingCenters = [];
        if (bt) {
            billingCenters.push("B&T Corretora");
        }

        if (poliedro) {
            billingCenters.push("poliedro");
        }

        return billingCenters;
    }

    public static remove_all(regexp: RegExp, entities: builder.IEntity[]): builder.IEntity[] {
        let resp: builder.IEntity[] = [];

        entities.forEach((e) => {
            if (!regexp.test(e.entity)) {
                resp.push(e);
            }
        });

        return resp;
    }

    public static capitalizeFirstLetter(str): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public static has_at_least_one(regexp: RegExp, entities: builder.IEntity[]): boolean {
        for (let e of entities) {
            if (regexp.test(e.entity)) {
                return true;
            }
        }

        return false;
    }
}
