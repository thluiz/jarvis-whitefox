"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemBacklog {
    static serialize(recordSet) {
        const data = recordSet[0][0];
        return new ItemBacklog(data.Id, data.Name);
    }
    static serializeAll(recordSet) {
        let items = [];
        recordSet[0][0].forEach(p => {
            items.push(ItemBacklog.create(p.id, p.name));
        });
        return items;
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