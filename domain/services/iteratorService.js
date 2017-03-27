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
const http = require("http");
const result_1 = require("../../domain/result");
const iteratorBaseRepository_1 = require("../repositories/iteratorBaseRepository");
const sqlParameter_1 = require("../sqlParameter");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
class IteratorService {
    static convertComplexity2Number(complexity) {
        const half = /(0.5|meio|meia|0\ .\ 5|0\,5|0\ \,\ 5)/;
        const one = /(1|um|uma)/;
        const two = /(2|dois|duas)/;
        const three = /(3|tres|três)/;
        const five = /(5|cinco)/;
        const eight = /(8|oito)/;
        const thirteen = /(13|treze)/;
        if (half.test(complexity)) {
            return 0.5;
        }
        if (one.test(complexity)) {
            return 1;
        }
        if (two.test(complexity)) {
            return 2;
        }
        if (three.test(complexity)) {
            return 3;
        }
        if (five.test(complexity)) {
            return 5;
        }
        if (eight.test(complexity)) {
            return 8;
        }
        if (thirteen.test(complexity)) {
            return 13;
        }
        const parsed = parseInt(complexity, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
    static ValidateProjectForNewTask(user, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("ValidateProjectForNewItemBacklog", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("projectId", projectId));
        });
    }
    static ValidateTaskForNewActivity(user, itemBacklogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("ValidateItemBacklogForNewActivity", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("itemBacklogId", itemBacklogId));
        });
    }
    static Search(user, onlyOwn, projects, billingCenters, locations, text, maxItens = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSP("Search", (r) => { return r.results; }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("maxItems", maxItens), sqlParameter_1.SQLParameter.NVarCharMax("locations", locations.join(",")), sqlParameter_1.SQLParameter.NVarCharMax("billingCenters", billingCenters.join(",")), sqlParameter_1.SQLParameter.NVarCharMax("projects", projects.join(",")), sqlParameter_1.SQLParameter.NVarChar("text", text, 180));
        });
    }
    static createActivity(user, taskId, title, complexity) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("CreateTask", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("itemBacklogId", taskId), sqlParameter_1.SQLParameter.Decimal("complexity", complexity, 3, 1), sqlParameter_1.SQLParameter.NVarChar("title", title, 100));
        });
    }
    static updateIncidents() {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                host: process.env.ITERATORSITE_URL,
                path: process.env.ITERATORSITE_UpdateIncidentsPath,
            };
            const [err, result] = yield await_to_js_1.default(new Promise((resolve) => {
                http.get(options, (res) => {
                    if (res.statusCode === 200) {
                        resolve(result_1.Result.Ok());
                    }
                    else {
                        resolve(result_1.Result.Fail(`Error: ${res.statusCode}`));
                    }
                }).on("error", (error) => {
                    if (error) {
                        resolve(result_1.Result.Fail(err.message));
                    }
                });
            }));
            if (err) {
                return result_1.Result.Fail(err.message);
            }
            return result;
        });
    }
}
exports.IteratorService = IteratorService;
//# sourceMappingURL=iteratorService.js.map