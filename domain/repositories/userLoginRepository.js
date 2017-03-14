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
const securityBaseRepository_1 = require("./securityBaseRepository");
class UserLoginRepository extends securityBaseRepository_1.SecurityBaseRepository {
    static revokeAccess(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return result_1.Result.Ok();
        });
    }
    static getAvailableCommands(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                return result_1.Result.Fail("Você precisa se logar para ter acesso aos comandos. Utilize o comando 'relogar'.");
            return result_1.Result.Ok(`    
            'gerar CPF|CNPJ' - quem nunca precisou de um CPF ou CNPJ rapidinho para fazer um teste?            

            'jogar moeda' - para aqueles momentos de dúvida na vida.
            
            'relogar' - encerra sua sessão, pede um novo email e tenta gerar um novo token;

            'atualizar token' - Gera um novo token de acesso para o usuário atual e atualiza as permissões.

            'help|ajuda' - você é uma homem de pouca fé? não tem muito o eu que possa fazer ainda, mas vai rezando aí que daqui a pouco funciona...
        `);
        });
    }
}
exports.UserLoginRepository = UserLoginRepository;
//# sourceMappingURL=userLoginRepository.js.map