"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("./baseRepository");
class SecurityBaseRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(process.env.SECURITYDB_ADDRESS, process.env.SECURITYDB_DATABASE, process.env.SECURITYDB_USER, process.env.SECURITYDB_PASSAWORD);
    }
}
exports.SecurityBaseRepository = SecurityBaseRepository;
//# sourceMappingURL=securityBaseRepository.js.map