import { IAddress } from "botbuilder";
import { Result } from "../../domain/result";
import { LoginRequest } from "../entities";
import { SQLParameter } from "../sqlParameter";
import { SecurityBaseRepository } from "./securityBaseRepository";

export class LoginRequestRepository extends SecurityBaseRepository {
    public async create(email: string, token: string,
                        temporaryToken: string, responseAddress: IAddress): Promise<Result<any>> {

        const request = await this.executeSPNoResult("CreateLoginRequest",
            SQLParameter.NVarChar("token", token, 30),
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30),
            SQLParameter.NVarChar("email", email, 80),
            SQLParameter.JSON("details", responseAddress),
        );

        if (!request.success) {
            return Result.Fail<any>(request.message);
        }

        return Result.Ok();
    }

    public async approveAccess(temporaryToken: string): Promise<Result<LoginRequest>> {
        return this.executeSP("ApproveLoginRequest",
            LoginRequest.serialize,
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30),
        );
    }
}
