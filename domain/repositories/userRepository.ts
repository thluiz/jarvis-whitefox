import { DataResult } from '../../support/result';
import { IteratorBaseRepository } from './iteratorBaseRepository'
import { SQLParameter } from './baseRepository';
import { User } from '../entities';

export class UserRepository extends IteratorBaseRepository {

    async load(securityId: number): Promise<DataResult<User>> {
        const result = await this.executeSP("GetUserData",
            User.serialize,
            SQLParameter.Int("securityId", securityId));

        if (!result.success)
            return result;

        return DataResult.Ok(result.data);
    }

    /** TODO: Refatorar */
    static async revokeAccess(token: string): Promise<DataResult<any>> {
        return DataResult.Ok();
    }

    static async getAvailableCommands(user: User): Promise<DataResult<string>> {
        if (user.id <= 0) {
            return DataResult.Fail<string>("Você precisa se logar para ter acesso aos comandos. Utilize o comando 'relogar'.");
        }

        return DataResult.Ok(`    
            'gerar CPF|CNPJ' - quem nunca precisou de um CPF ou CNPJ rapidinho para fazer um teste?            

            'jogar moeda' - para aqueles momentos de dúvida na vida.
            
            'relogar' - encerra sua sessão, pede um novo email e tenta gerar um novo token;

            'atualizar token' - Gera um novo token de acesso para o usuário atual e atualiza as permissões.

            'help|ajuda' - você é uma homem de pouca fé? não tem muito o eu que possa fazer ainda, 
            mas vai rezando aí que daqui a pouco funciona...
        `);
    }
}