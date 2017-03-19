import { IAddress } from "botbuilder";
import { Result } from "../../domain/result";
import { LoginRequest, User } from "../entities";
import { LoginRequestRepository } from "../repositories/loginRequestRepository";
import { UserRepository } from "../repositories/userRepository";
import { IService } from "./service";
import { EmailService, UtilsService } from "./service";
import { SecurityTemplates } from "./templates/securityTemplates";

const UR = new UserRepository();

export class SecurityService implements IService {
    public static validateEmail(email: string): boolean {
        // tslint:disable-next-line:max-line-length
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    public static getAvailableCommands(user: User): Promise<Result<string>> {
        return UR.getAvailableCommands(user);
    }

    public static async approveAccess(temporaryToken: string): Promise<Result<LoginRequest>> {
        return (new LoginRequestRepository()).approveAccess(temporaryToken);
    }

    public static async createLoginRequest(email: string, responseAddress: IAddress): Promise<Result<string>> {
        const token = UtilsService.randomString(18);
        const temporaryToken = UtilsService.randomString(30);

        const sp = await (new LoginRequestRepository()).create(email,
            token, temporaryToken, responseAddress);

        if (!sp.success) {
            return Result.Fail<string>(sp.message);
        }

        return Result.Ok(temporaryToken);
    }

    public static async sendLoginRequestEmail(channel: string, email: string,
                                              temporaryToken: string): Promise<Result<string>> {

        return EmailService.send(email, "Habilitar acesso as minhas funções",
            SecurityTemplates.LoginRequestEmail(channel, temporaryToken));
    }

    public static async getWelcomeMessage(user: User): Promise<Result<string>> {
        const commands = await SecurityService.getAvailableCommands(user);
        return Result.Ok(SecurityTemplates.WelcomeMessage(user.name, commands.data));
    }
}
