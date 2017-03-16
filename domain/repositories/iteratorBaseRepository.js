"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("./baseRepository");
class IteratorBaseRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(process.env.ITERATORDB_ADDRESS, process.env.ITERATORDB_DATABASE, process.env.ITERATORDB_USER, process.env.ITERATORDB_PASSAWORD);
    }
}
exports.IteratorBaseRepository = IteratorBaseRepository;
//# sourceMappingURL=iteratorBaseRepository.js.map