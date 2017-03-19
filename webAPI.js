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
const userRepository_1 = require("./domain/repositories/userRepository");
const securityService_1 = require("./domain/services/securityService");
class WebAPI {
    static setup(server, connector, bot) {
        return new WebAPI(server, connector, bot);
    }
    constructor(server, connector, bot) {
        server.post("/api/messages", connector.listen());
        server.get("/api/security/allow/:temporaryToken", (request, response, next) => __awaiter(this, void 0, void 0, function* () { return this.allowAccess(request, response, next, bot); }));
    }
    allowAccess(request, response, next, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const temporaryToken = request.params.temporaryToken;
            const loginResult = yield securityService_1.SecurityService.approveAccess(temporaryToken);
            if (!loginResult.success) {
                // tslint:disable-next-line:max-line-length
                return response.send(`Erro ao aprovar esse acesso. Tente novamente ou acione o suporte e informe a mensagem: "${loginResult.message}"`);
            }
            const UR = new userRepository_1.UserRepository();
            const userResult = yield UR.load(loginResult.data.securityId);
            if (!userResult.success) {
                // tslint:disable-next-line:max-line-length
                return response.send(`Erro ao obter o usuário. Tente novamente ou acione o suporte e informe a mensagem: "${userResult.message}"`);
            }
            bot.beginDialog(loginResult.data.address, "/saveSessionAndNotify", {
                login: loginResult.data,
                user: userResult.data,
            });
            if (next) {
                next();
            }
            return response.send(`Token liberado, nos falamos pelo chat!`);
        });
    }
}
exports.WebAPI = WebAPI;
//# sourceMappingURL=webAPI.js.map