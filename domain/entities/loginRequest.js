"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginRequest {
    static serialize(recordSet) {
        let data = recordSet[0][0];
        if (!data.success) {
            throw `Erro ao obter o login do usuário: ${data.message}`;
        }
        const token = data.providerKey;
        const securityId = data.userId;
        const name = data.name;
        const address = JSON.parse(JSON.parse(data.details));
        return new LoginRequest(token, securityId, address, name);
    }
    constructor(token, securityId, address, name) {
        this.token = token;
        this.securityId = securityId;
        this.address = address;
        this.name = name;
    }
}
exports.LoginRequest = LoginRequest;
//# sourceMappingURL=loginRequest.js.map