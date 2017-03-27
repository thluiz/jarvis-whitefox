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
const await_to_js_1 = require("await-to-js");
const builder = require("botbuilder");
const service_1 = require("../domain/services/service");
const utilsService_1 = require("../domain/services/utilsService");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const IE = new intentEntities_1.IntentEntities();
class QueryIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("query", [
            (session, args, next) => __awaiter(this, void 0, void 0, function* () {
                // tslint:disable-next-line:max-line-length
                if (!this.checkUserLogedIn(session, "Para realizar as consultas, preciso saber quem é você, ok? ")) {
                    return;
                }
                const locations = builder.EntityRecognizer.findAllEntities(args.entities, IE.Location);
                const projectOrBCs = builder.EntityRecognizer.findAllEntities(args.entities, IE.ProjectBillingCenter);
                const restrictions = builder.EntityRecognizer.findAllEntities(args.entities, IE.Target);
                const text = builder.EntityRecognizer.findAllEntities(args.entities, IE.Text);
                let bt = utilsService_1.UtilsService.has_billingcenter_bt(projectOrBCs);
                let poliedro = utilsService_1.UtilsService.has_billingcenter_poliedro(projectOrBCs);
                let projects = utilsService_1.UtilsService.extract_projects(projectOrBCs);
                session.sendTyping();
                const [err, results] = yield await_to_js_1.default(service_1.IteratorService.search(session.userData.user, false, projects, utilsService_1.UtilsService.setup_billing_centers(bt, poliedro), utilsService_1.UtilsService.setup_locations(locations), text.map((t) => { return t.entity; }).join(" ")));
                if (err || !results.success) {
                    session.endDialog(`Ocorreu o seguinte erro: ${(results || err).message}`);
                    return;
                }
                if (!results.data) {
                    session.send("Nenhum registro encontrado!");
                    return;
                }
                let total = 0;
                let response = "";
                for (let d of results.data) {
                    response += utilsService_1.UtilsService.getLocationTitle(d.type) + ": \n\n";
                    for (let i of d.items) {
                        response += ` * ${i.id} - ${i.name} \n\n`;
                        total++;
                    }
                }
                session.send(this.get_response_text(total) + response);
            }),
        ]);
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