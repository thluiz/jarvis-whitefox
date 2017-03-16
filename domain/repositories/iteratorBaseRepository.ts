import { BaseRepository } from "./baseRepository";

export class IteratorBaseRepository extends BaseRepository {
    constructor() {
        super(process.env.ITERATORDB_ADDRESS, process.env.ITERATORDB_DATABASE,
            process.env.ITERATORDB_USER, process.env.ITERATORDB_PASSAWORD);
    }
}