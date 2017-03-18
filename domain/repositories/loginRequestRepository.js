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
const result_1 = require("../../support/result");
const entities_1 = require("../entities");
const sqlParameter_1 = require("../sqlParameter");
const securityBaseRepository_1 = require("./securityBaseRepository");
class LoginRequestRepository extends securityBaseRepository_1.SecurityBaseRepository {
    create(email, token, temporaryToken, responseAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            let serialize = (recordset) => {
                const data = recordset[0][0];
                return {
                    message: data.message,
                    success: data.success,
                };
            };
            const request = yield this.executeSP("CreateLoginRequest", serialize, sqlParameter_1.SQLParameter.NVarChar("token", token, 30), sqlParameter_1.SQLParameter.NVarChar("temporaryToken", temporaryToken, 30), sqlParameter_1.SQLParameter.NVarChar("email", email, 80), sqlParameter_1.SQLParameter.JSON("details", responseAddress));
            if (!request.data.success) {
                return result_1.Result.Fail(request.data.message);
            }
            return result_1.Result.Ok(request.data.message);
        });
    }
    approveAccess(temporaryToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeSP("ApproveLoginRequest", entities_1.LoginRequest.serialize, sqlParameter_1.SQLParameter.NVarChar("temporaryToken", temporaryToken, 30));
        });
    }
}
exports.LoginRequestRepository = LoginRequestRepository;
//# sourceMappingURL=loginRequestRepository.js.map