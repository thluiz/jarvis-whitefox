"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemBacklog {
    static serialize(recordSet) {
        return ItemBacklog.create(recordSet.id, recordSet.name);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    static create(id, name) {
        return new ItemBacklog(id, name);
    }
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.ItemBacklog = ItemBacklog;
//# sourceMappingURL=itemBacklog.js.map