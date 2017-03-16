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
const securityBaseRepository_1 = require("./securityBaseRepository");
const entities_1 = require("../entities");
class LoginRequestRepository extends securityBaseRepository_1.SecurityBaseRepository {
    create(email, token, temporaryToken, responseAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeSPNoResult("CreateLoginRequest", baseRepository_1.SQLParameter.NVarChar("token", token, 30), baseRepository_1.SQLParameter.NVarChar("temporaryToken", temporaryToken, 30), baseRepository_1.SQLParameter.NVarChar("email", email, 80), baseRepository_1.SQLParameter.JSON("details", responseAddress));
        });
    }
    approveAccess(temporaryToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeSP("ApproveLoginRequest", entities_1.LoginRequest.serialize, baseRepository_1.SQLParameter.NVarChar("temporaryToken", temporaryToken, 30));
        });
    }
}
exports.LoginRequestRepository = LoginRequestRepository;
//# sourceMappingURL=loginRequestRepository.js.map