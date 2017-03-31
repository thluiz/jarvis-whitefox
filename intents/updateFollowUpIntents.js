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
const constants_1 = require("../domain/constants");
const iteratorBaseRepository_1 = require("../domain/repositories/iteratorBaseRepository");
const sqlParameter_1 = require("../domain/sqlParameter");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
const IE = new intentEntities_1.IntentEntities();
class UpdateFollowupIntents extends intentBase_1.IntentBase {
    setup(dialog) {
        dialog.matches("update_followup", [
            (session, args, next) => __awaiter(this, void 0, void 0, function* () {
                session.send("Esse é um pouco lento, peraí... ");
                session.sendTyping();
                const [err, result] = yield await_to_js_1.default(IR.executeSPNoResult("FillFutureWorkDaysSlots", sqlParameter_1.SQLParameter.Int("billingCenterId", constants_1.Constants.BillingCenterBT)));
                if (err || !result.success) {
                    session.endDialog(`Ops! aconteceu algum erro: ${(err || result).message || "Não definido"}`);
                }
                else {
                    session.endDialog(`Ok! acompanhamento atualizado!`);
                }
            }),
        ]);
    }
}
exports.UpdateFollowupIntents = UpdateFollowupIntents;
//# sourceMappingURL=updateFollowUpIntents.js.map