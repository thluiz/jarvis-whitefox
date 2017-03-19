import { IAddress } from "botbuilder";

export class LoginRequest {
    public static serialize(recordSet: any): LoginRequest {
        return LoginRequest.create(recordSet.providerKey,
                                recordSet.userId,
                                recordSet.name,
                                JSON.parse(recordSet.details),
                                );
    }

    public static create(token: string, securityId: number, name: string, address: IAddress): LoginRequest {
        return new LoginRequest(token, securityId, name, address);
    }

    public token: string;
    public securityId: number;
    public name: string;
    public address: IAddress;

    constructor(token: string, securityId: number, name: string, address: IAddress) {
        this.token = token;
        this.securityId = securityId;
        this.name = name;
        this.address = address;
    }
}
