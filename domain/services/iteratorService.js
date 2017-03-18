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
const Domain = require("../entities");
const list_1 = require("../list");
const iteratorBaseRepository_1 = require("../repositories/iteratorBaseRepository");
const sqlParameter_1 = require("../sqlParameter");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
class IteratorService {
    // tslint:disable-next-line:max-line-length
    static SearchItemBackLog(user, title, maxItens) {
        return __awaiter(this, void 0, void 0, function* () {
            let serialize = (recordset) => {
                let ib = new list_1.List();
                let items = [];
                recordset[0][0].items.forEach((el) => {
                    items.push(new Domain.ItemBacklog(el.id, el.name));
                });
                ib.totalCount = recordset[0][0].total;
                ib.items = items;
                return ib;
            };
            return IR.executeSP("SearchItemBacklog", serialize, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("maxItens", maxItens), sqlParameter_1.SQLParameter.NVarChar("title", title, 180));
        });
    }
    static createTask(user, itemBacklog, title, complexity) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("CreateTask", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("itemBacklogId", itemBacklog.id), sqlParameter_1.SQLParameter.Decimal("complexity", complexity, 3, 1), sqlParameter_1.SQLParameter.NVarChar("title", title, 180));
        });
    }
}
exports.IteratorService = IteratorService;
//# sourceMappingURL=iteratorService.js.map