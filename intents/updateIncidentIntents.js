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
const service_1 = require("../domain/services/service");
const intentBase_1 = require("./intentBase");
class UpdateIncidentsIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("update_incident", [
            (session, args, next) => __awaiter(this, void 0, void 0, function* () {
                session.sendTyping();
                const [err, result] = yield await_to_js_1.default(service_1.IteratorService.updateIncidents());
                if (err || !result.success) {
                    session.endDialog(`Ops! aconteceu algum erro: ${(err || result).message || "Não definido"}`);
                }
                else {
                    session.endDialog(`Ok! chamados atualizados no iterator!`);
                }
            }),
        ]);
    }
}
exports.UpdateIncidentsIntents = UpdateIncidentsIntents;
//# sourceMappingURL=updateIncidentIntents.js.map