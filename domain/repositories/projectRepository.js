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
const baseRepository_1 = require("./baseRepository");
const iteratorBaseRepository_1 = require("./iteratorBaseRepository");
const entities_1 = require("../entities");
class ProjectRepository extends iteratorBaseRepository_1.IteratorBaseRepository {
    getProjects(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeSP("GetUserProjects", entities_1.Project.serializeAll, baseRepository_1.SQLParameter.Int("userId", user.id));
        });
    }
}
exports.ProjectRepository = ProjectRepository;
//# sourceMappingURL=projectRepository.js.map