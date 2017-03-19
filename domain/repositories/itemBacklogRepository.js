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
const result_1 = require("../../domain/result");
const entities_1 = require("../entities");
const sqlParameter_1 = require("../sqlParameter");
const iteratorBaseRepository_1 = require("./iteratorBaseRepository");
class ItembacklogRepository extends iteratorBaseRepository_1.IteratorBaseRepository {
    load(itemBacklogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.executeSP("GetItemBacklogData", entities_1.ItemBacklog.serialize, sqlParameter_1.SQLParameter.Int("itemBacklogId", itemBacklogId));
            if (!result.success) {
                return result;
            }
            return result_1.Result.Ok(result.data);
        });
    }
}
exports.ItembacklogRepository = ItembacklogRepository;
//# sourceMappingURL=itemBacklogRepository.js.map