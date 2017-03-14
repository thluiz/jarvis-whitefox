
import { Result } from '../../support/result';
import { ParameterType, SQLParameter } from './baseRepository';
import { SecurityBaseRepository } from './securityBaseRepository';

export class LoginRequestRepository extends SecurityBaseRepository {
    async create(email: string, token: string, temporaryToken: string, responseAddress: string): Promise<Result> {
        return this.executeSP("CreateLoginRequest",
            SQLParameter.NVarChar("token", token, 30),
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30),
            SQLParameter.NVarChar("email", email, 80),
            SQLParameter.JSON("details", responseAddress)
        );
    }

    async approveAccess(temporaryToken: string): Promise<Result> {
        return this.executeSP("ApproveLoginRequest",
            SQLParameter.NVarChar("temporaryToken", temporaryToken, 30)            
        );
    }
}