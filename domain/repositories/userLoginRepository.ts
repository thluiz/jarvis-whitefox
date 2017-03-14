import { Result } from '../../support/result';
import { SecurityBaseRepository } from './securityBaseRepository'

export class UserLoginRepository extends SecurityBaseRepository {
    static async revokeAccess(token: string): Promise<Result> {
        return Result.Ok();
    }

    static async getAvailableCommands(token: string) : Promise<Result> {
        if(!token)
            return Result.Fail("Você precisa se logar para ter acesso aos comandos. Utilize o comando 'relogar'.");

        return Result.Ok(`    
            'gerar CPF|CNPJ' - quem nunca precisou de um CPF ou CNPJ rapidinho para fazer um teste?            

            'jogar moeda' - para aqueles momentos de dúvida na vida.
            
            'relogar' - encerra sua sessão, pede um novo email e tenta gerar um novo token;

            'atualizar token' - Gera um novo token de acesso para o usuário atual e atualiza as permissões.

            'help|ajuda' - você é uma homem de pouca fé? não tem muito o eu que possa fazer ainda, mas vai rezando aí que daqui a pouco funciona...
        `);
    }
}