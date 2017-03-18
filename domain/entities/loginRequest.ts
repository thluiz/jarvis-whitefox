import { IAddress } from "botbuilder";

export class LoginRequest {
    public static serialize(recordSet: any): LoginRequest {
        let data: any = recordSet[0][0];

        if (!data.success) {
            throw `Erro ao obter o login do usuário: ${data.message}`;
        }

        const token: string = data.providerKey;
        const securityId: number = data.userId;
        const name: string = data.name;
        const address: IAddress = <IAddress> JSON.parse(JSON.parse(data.details));

        return new LoginRequest(token, securityId, address, name);
    }

    public token: string;
    public securityId: number;
    public address: IAddress;
    public name: string;

    constructor(token: string, securityId: number, address: IAddress, name: string) {
        this.token = token;
        this.securityId = securityId;
        this.address = address;
        this.name = name;
    }
}
