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
const entities_1 = require("../entities");
const Domain = require("../entities");
const iteratorBaseRepository_1 = require("../repositories/iteratorBaseRepository");
const sqlParameter_1 = require("../sqlParameter");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
class IteratorService {
    static getUsersProjects(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSP("GetUsersProjects", (rs) => { return Domain.Project.serializeAll(rs.results); }, sqlParameter_1.SQLParameter.Int("userId", user.id));
        });
    }
    static getProjectAreas(project) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSP("GetProjectAreas", (rs) => { return Domain.FeatureArea.serializeAll(rs.results); }, sqlParameter_1.SQLParameter.Int("projectId", project.id));
        });
    }
    static getTaskComplexities(user, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = task;
            const [err, complexities] = yield await_to_js_1.default(IR.executeSP("GetTaskComplexities", (e) => { return e; }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("taskId", task.id)));
            if (err || !complexities.success) {
                return result_1.Result.Fail((err || complexities).message);
            }
            result.complexity = complexities.data.complexity;
            result.complexityDone = complexities.data.complexityDone;
            return result_1.Result.Ok(result);
        });
    }
    static getTaskEvidences(user, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = task;
            const [err, evidences] = yield await_to_js_1.default(IR.executeSP("GetTaskEvidences", (r) => { return r.results; }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("taskId", task.id)));
            if (err || !evidences.success) {
                return result_1.Result.Fail((err || evidences).message);
            }
            result.evidences = evidences.data ? evidences.data.map((m) => m.evidence) : [];
            return result_1.Result.Ok(result);
        });
    }
    static getTaskDescriptions(user, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = task;
            const [err, descriptions] = yield await_to_js_1.default(IR.executeSP("GetTaskDescriptions", (r) => { return r.results; }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("taskId", task.id)));
            if (err || !descriptions.success) {
                return result_1.Result.Fail((err || descriptions).message);
            }
            result.description = descriptions.data ? descriptions.data.map((m) => m.description) : [];
            return result_1.Result.Ok(result);
        });
    }
    static getTaskActivities(user, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = task;
            const [err, activities] = yield await_to_js_1.default(IR.executeSP("GetTaskActivities", (r) => { return entities_1.Activity.serializeAll(r.results); }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("taskId", task.id)));
            if (err || !activities.success) {
                return result_1.Result.Fail((err || activities).message);
            }
            result.activities = activities.data;
            return result_1.Result.Ok(result);
        });
    }
    static convertComplexity2Number(complexity) {
        const half = /(0.5|meio|meia|0\ .\ 5|0\,5|0\ \,\ 5)/;
        const one = /(1|um|uma)/;
        const two = /(2|dois|duas)/;
        const three = /(3|tres|três)/;
        const five = /(5|cinco)/;
        const eight = /(8|oito)/;
        const thirteen = /(13|treze)/;
        const parsed = parseInt(complexity, 10);
        if (!isNaN(parsed)) {
            return parsed;
        }
        if (half.test(complexity)) {
            return 0.5;
        }
        if (thirteen.test(complexity)) {
            return 13;
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
        return 0;
    }
    static validateProjectForNewTask(user, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("ValidateProjectForNewItemBacklog", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("projectId", projectId));
        });
    }
    static validateTaskForNewActivity(user, itemBacklogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("ValidateItemBacklogForNewActivity", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("itemBacklogId", itemBacklogId));
        });
    }
    static search(user, onlyOwn, projects, billingCenters, locations, text, maxItens = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSP("Search", (r) => { return r.results; }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("maxItems", maxItens), sqlParameter_1.SQLParameter.NVarCharMax("locations", locations.join(",")), sqlParameter_1.SQLParameter.NVarCharMax("billingCenters", billingCenters.join(",")), sqlParameter_1.SQLParameter.NVarCharMax("projects", projects.join(",")), sqlParameter_1.SQLParameter.NVarChar("text", text, 180));
        });
    }
    static createActivity(user, taskId, title, complexity) {
        return __awaiter(this, void 0, void 0, function* () {
            return IR.executeSPNoResult("CreateTask", sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("itemBacklogId", taskId), sqlParameter_1.SQLParameter.Decimal("complexity", complexity, 3, 1), sqlParameter_1.SQLParameter.NVarChar("title", title, 100));
        });
    }
    static createTask(user, project, area, title, complexity, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let [err, taskResult] = yield await_to_js_1.default(IR.executeSP("CreateItemBacklog", (rs) => { return { id: rs.id }; }, sqlParameter_1.SQLParameter.Int("userId", user.id), sqlParameter_1.SQLParameter.Int("projectId", project.id), sqlParameter_1.SQLParameter.Int("area", area ? area.id : 0), sqlParameter_1.SQLParameter.Decimal("complexity", complexity, 3, 1), sqlParameter_1.SQLParameter.NVarChar("title", title, 100), sqlParameter_1.SQLParameter.NVarCharMax("description", description)));
            if (err) {
                return result_1.Result.Fail(err.message);
            }
            return taskResult;
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