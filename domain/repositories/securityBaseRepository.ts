import { BaseRepository } from "./baseRepository";

export class SecurityBaseRepository extends BaseRepository {
    constructor() {
        super(process.env.SECURITYDB_ADDRESS, process.env.SECURITYDB_DATABASE,
            process.env.SECURITYDB_USER, process.env.SECURITYDB_PASSAWORD);
    }
}
