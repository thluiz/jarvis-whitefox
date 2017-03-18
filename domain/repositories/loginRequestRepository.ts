import { Result } from "../../support/result";
import { LoginRequest } from "../entities";
import { SQLParameter } from "../sqlParameter";
import { SecurityBaseRepository } from "./securityBaseRepository";

export class LoginRequestRepository extends SecurityBaseRepository {
    public async create(email: string, token: string,
                        temporaryToken: string, responseAddress: string): Promise<Result<any>> {

        let serialize = (recordset) : any => {
            const data = recordset[0][0];

            return {
                message: data.message,
                success: data.success,
            };
        };

        const request = await this.executeSP ("CreateLoginRequest",
            serialize,
            SQLParameter.NVarChar("token", token, 30),
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30),
            SQLParameter.NVarChar("email", email, 80),
            SQLParameter.JSON("details", responseAddress),
        );

        if (!request.data.success) {
            return Result.Fail<any>(request.data.message);
        }

        return Result.Ok(request.data.message);
    }

    public async approveAccess(temporaryToken: string): Promise<Result<LoginRequest>> {
        return this.executeSP("ApproveLoginRequest",
            LoginRequest.serialize,
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30),
        );
    }
}
