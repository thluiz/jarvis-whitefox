"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginRequest {
    static serialize(recordSet) {
        return LoginRequest.create(recordSet.providerKey, recordSet.userId, recordSet.name, JSON.parse(recordSet.details));
    }
    static create(token, securityId, name, address) {
        return new LoginRequest(token, securityId, name, address);
    }
    constructor(token, securityId, name, address) {
        this.token = token;
        this.securityId = securityId;
        this.name = name;
        this.address = address;
    }
}
exports.LoginRequest = LoginRequest;
//# sourceMappingURL=loginRequest.js.map