import { Service } from './Service';
import { Result } from '../../support/result';
import { EmailService } from './emailService';
import { IAddress } from 'botbuilder';
import { Helpers } from '../../support/helpers';
import { UserLoginRepository } from '../repositories/userLoginRepository'
import { LoginRequestRepository } from '../repositories/loginRequestRepository'

export class SecurityService implements Service {
    static validateEmail(email: string): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    static async revokeAccess(token:string): Promise<Result> {
        return UserLoginRepository.revokeAccess(token);
    }

    static getAvailableCommands(token:string): Promise<Result> {
        return UserLoginRepository.getAvailableCommands(token);
    }

    static async approveAccess(temporaryToken:string): Promise<Result> {
        return (new LoginRequestRepository()).approveAccess(temporaryToken);
    }

    static async createLoginRequest(email: string, responseAdress: IAddress): Promise<Result> {
        const token = Helpers.generateRandomString(18);
        const temporaryToken = Helpers.generateRandomString(30);        
        
        const sp = await (new LoginRequestRepository()).create(email, token, temporaryToken, JSON.stringify(responseAdress));
        sp.data = temporaryToken;
        
        return sp;
    }

    static async sendLoginRequestEmail(channel: string, email: string, temporaryToken: string): Promise<Result> {
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
        return EmailService.send(email, "Habilitar acesso as minhas funções", body);
    }
}  
