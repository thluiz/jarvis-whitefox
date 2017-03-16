/// <reference path="../../typings/index.d.ts" />
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
const baseRepository_1 = require("../repositories/baseRepository");
const iteratorBaseRepository_1 = require("../repositories/iteratorBaseRepository");
const Domain = require("../entities");
class ItemBacklogListWithTotalCount {
    static serialize(recordset) {
        let ib = new ItemBacklogListWithTotalCount();
        let items = [];
        recordset[0][0].items.forEach(el => {
            items.push(new Domain.ItemBacklog(el.id, el.name));
        });
        ib.totalCount = recordset[0][0].total;
        ib.items = items;
        return ib;
    }
}
exports.ItemBacklogListWithTotalCount = ItemBacklogListWithTotalCount;
class IteratorService {
    static SearchItemBackLog(user, title, maxItens) {
        return __awaiter(this, void 0, void 0, function* () {
            const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
            return IR.executeSP("SearchItemBacklog", ItemBacklogListWithTotalCount.serialize, baseRepository_1.SQLParameter.Int("userId", user.id), baseRepository_1.SQLParameter.Int("maxItens", maxItens), baseRepository_1.SQLParameter.NVarChar("title", title, 180));
        });
    }
}
exports.IteratorService = IteratorService;
//# sourceMappingURL=iteratorService.js.map