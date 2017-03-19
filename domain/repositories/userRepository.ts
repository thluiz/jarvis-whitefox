import { Result } from "../../domain/result";
import { User } from "../entities";
import { SQLParameter } from "../sqlParameter";
import { IteratorBaseRepository } from "./iteratorBaseRepository";

export class UserRepository extends IteratorBaseRepository {

    public async load(securityId: number): Promise<Result<User>> {
        const result: Result<User> = await this.executeSP("GetUserData",
            User.serialize,
            SQLParameter.Int("securityId", securityId));

        if (!result.success) {
            return result;
        }

        return Result.Ok(result.data);
    }

    public async getAvailableCommands(user: User): Promise<Result<string>> {
        if (user.id <= 0) {
            const msg = "Você precisa se logar para ter acesso aos comandos. Utilize o comando 'relogar'.";
            return Result.Fail<string>(msg);
        }

        // tslint:disable-next-line:max-line-length
        return Result.Ok(`                
            'gerar cpf' - Quem nunca precisou de um CPF ou CNPJ rapidinho para fazer um teste? é só pedir: "Oh! Grande Jarvis, poderia por obséquio gerar um CPF?"... não precisa disso tudo :), mas você entendeu a ideia né?
            Estou ficando tão bom nisso que você pode pode ainda pedir detalhes da formação, 
                por exemplo: "gerar cpf sem formatação" ou "preciso de um cpf sem pontos"...

            '[jogar moeda]' - para aqueles momentos de dúvida na vida.
            
            '[relogar]' - encerra sua sessão, pede um novo email e tenta gerar um novo token;

            '[help|ajuda]' - você é uma homem de pouca fé? não tem muito o eu que possa fazer ainda, 
            mas vai rezando aí que daqui a pouco funciona...
        `);
    }
}
