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
class UserRepository extends iteratorBaseRepository_1.IteratorBaseRepository {
    getUserSpeed(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.executeSP("GetUserSpeed", (r) => r, sqlParameter_1.SQLParameter.Int("userId", user.id));
        });
    }
    getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.executeSP("getUserByName", entities_1.User.serializeAll, sqlParameter_1.SQLParameter.NVarChar("name", name, 50));
            if (!result.success) {
                return result;
            }
            return result_1.Result.Ok(result.data);
        });
    }
    load(securityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.executeSP("GetUserData", entities_1.User.serialize, sqlParameter_1.SQLParameter.Int("securityId", securityId));
            if (!result.success) {
                return result;
            }
            return result_1.Result.Ok(result.data);
        });
    }
    getAvailableCommands(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.id <= 0) {
                const msg = "Você precisa se logar para ter acesso aos comandos. Utilize o comando 'relogar'.";
                return result_1.Result.Fail(msg);
            }
            // tslint:disable-next-line:max-line-length
            return result_1.Result.Ok(`                
            'gerar cpf' - Quem nunca precisou de um CPF ou CNPJ rapidinho para fazer um teste? é só pedir: "Oh! Grande Jarvis, poderia por obséquio gerar um CPF?"... não precisa disso tudo :), mas você entendeu a ideia né?
            Estou ficando tão bom nisso que você pode pode ainda pedir detalhes da formação, 
                por exemplo: "gerar cpf sem formatação" ou "preciso de um cpf sem pontos"...

            '[jogar moeda]' - para aqueles momentos de dúvida na vida.
            
            '[relogar]' - encerra sua sessão, pede um novo email e tenta gerar um novo token;

            '[help|ajuda]' - você é uma homem de pouca fé? não tem muito o eu que possa fazer ainda, 
            mas vai rezando aí que daqui a pouco funciona...
        `);
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map