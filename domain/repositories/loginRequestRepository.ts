import { DataResult } from "../../support/result";
import { SQLParameter } from "./baseRepository";
import { SecurityBaseRepository } from "./securityBaseRepository";
import { LoginRequest } from "../entities";

export class LoginRequestRepository extends SecurityBaseRepository {
    async create(email: string, token: string, temporaryToken: string, responseAddress: string): Promise<DataResult<any>> {
        return this.executeSPNoResult("CreateLoginRequest",
            SQLParameter.NVarChar("token", token, 30),
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30),
            SQLParameter.NVarChar("email", email, 80),
            SQLParameter.JSON("details", responseAddress)
        );
    }

    async approveAccess(temporaryToken: string): Promise<DataResult<LoginRequest>> {
        return this.executeSP("ApproveLoginRequest",
            LoginRequest.serialize,
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30)
        );
    }
}