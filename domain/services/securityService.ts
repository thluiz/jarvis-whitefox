/// <reference path="../../typings/index.d.ts" />

import { Service } from "./Service";
import { DataResult } from "../../support/result";
import { EmailService } from "./emailService";
import { IAddress } from "botbuilder";
import { Helpers } from "../../support/helpers";
import { UserRepository } from "../repositories/userRepository";
import { LoginRequestRepository } from "../repositories/loginRequestRepository";
import { SecurityTemplates } from "./templates/securityTemplates";
import { User, LoginRequest } from "../entities";

export class SecurityService implements Service {
    static validateEmail(email: string): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    static async revokeAccess(token: string): Promise<DataResult<any>> {
        return UserRepository.revokeAccess(token);
    }

    static getAvailableCommands(user: User): Promise<DataResult<string>> {
        return UserRepository.getAvailableCommands(user);
    }

    static async approveAccess(temporaryToken: string): Promise<DataResult<LoginRequest>> {
        return (new LoginRequestRepository()).approveAccess(temporaryToken);
    }

    static async createLoginRequest(email: string, responseAddress: IAddress): Promise<DataResult<string>> {
        const token = Helpers.generateRandomString(18);
        const temporaryToken = Helpers.generateRandomString(30);

        const sp: DataResult<string> = await (new LoginRequestRepository())
            .create(email, token, temporaryToken, JSON.stringify(responseAddress));
        if (!sp.success) {
            return DataResult.Fail<string>(sp.message);
        }

        return DataResult.Ok(temporaryToken);
    }

    static async sendLoginRequestEmail(channel: string, email: string, temporaryToken: string): Promise<DataResult<string>> {
        return EmailService.send(email, "Habilitar acesso as minhas funções",
            SecurityTemplates.LoginRequestEmail(channel, temporaryToken));
    }

    static async getWelcomeMessage(user: User): Promise<DataResult<string>> {
        const commands: DataResult<string> = await SecurityService.getAvailableCommands(user);
        return DataResult.Ok(SecurityTemplates.WelcomeMessage(user.name, commands.data));
    }
}
