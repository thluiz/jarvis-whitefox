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
const loginRequestRepository_1 = require("../repositories/loginRequestRepository");
const userRepository_1 = require("../repositories/userRepository");
const service_1 = require("./service");
const securityTemplates_1 = require("./templates/securityTemplates");
const UR = new userRepository_1.UserRepository();
class SecurityService {
    static validateEmail(email) {
        // tslint:disable-next-line:max-line-length
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    static getAvailableCommands(user) {
        return UR.getAvailableCommands(user);
    }
    static approveAccess(temporaryToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return (new loginRequestRepository_1.LoginRequestRepository()).approveAccess(temporaryToken);
        });
    }
    static createLoginRequest(email, responseAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = service_1.UtilsService.randomString(18);
            const temporaryToken = service_1.UtilsService.randomString(30);
            const sp = yield (new loginRequestRepository_1.LoginRequestRepository()).create(email, token, temporaryToken, responseAddress);
            if (!sp.success) {
                return result_1.Result.Fail(sp.message);
            }
            return result_1.Result.Ok(temporaryToken);
        });
    }
    static sendLoginRequestEmail(channel, email, temporaryToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return service_1.EmailService.send(email, "Habilitar acesso as minhas funções", securityTemplates_1.SecurityTemplates.LoginRequestEmail(channel, temporaryToken));
        });
    }
    static getWelcomeMessage(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const commands = yield SecurityService.getAvailableCommands(user);
            return result_1.Result.Ok(securityTemplates_1.SecurityTemplates.WelcomeMessage(user.name, commands.data));
        });
    }
}
exports.SecurityService = SecurityService;
//# sourceMappingURL=SecurityService.js.map