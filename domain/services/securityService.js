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
const emailService_1 = require("./emailService");
const helpers_1 = require("../../support/helpers");
const userLoginRepository_1 = require("../repositories/userLoginRepository");
const loginRequestRepository_1 = require("../repositories/loginRequestRepository");
class SecurityService {
    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    static revokeAccess(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return userLoginRepository_1.UserLoginRepository.revokeAccess(token);
        });
    }
    static getAvailableCommands(token) {
        return userLoginRepository_1.UserLoginRepository.getAvailableCommands(token);
    }
    static approveAccess(temporaryToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return (new loginRequestRepository_1.LoginRequestRepository()).approveAccess(temporaryToken);
        });
    }
    static createLoginRequest(email, responseAdress) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = helpers_1.Helpers.generateRandomString(18);
            const temporaryToken = helpers_1.Helpers.generateRandomString(30);
            const sp = yield (new loginRequestRepository_1.LoginRequestRepository()).create(email, token, temporaryToken, JSON.stringify(responseAdress));
            sp.data = temporaryToken;
            return sp;
        });
    }
    static sendLoginRequestEmail(channel, email, temporaryToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverUrl = process.env.BOT_URL;
            const body = `
        Prezado,
        <br /><br />
        Aqui é o Jarvis, assistente virtual da White Fox.
        <br /><br />
        Um usuário no [${channel}] solicitou o acesso às minhas funções, caso seja você basta clicar <a href='${serverUrl}/api/security/allow/${temporaryToken}'>aqui</a>.
        <br /><br />
        Do contrário, basta desconsiderar que depois eu limpo.
        <br /><br /><br />
        Atencionsamente, 
        <br />
        --
        Jarvis`;
            console.log(body);
            return emailService_1.EmailService.send(email, "Habilitar acesso as minhas funções", body);
        });
    }
}
exports.SecurityService = SecurityService;
//# sourceMappingURL=securityService.js.map