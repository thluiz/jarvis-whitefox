"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    static serialize(recordSet) {
        return Task.create(recordSet.id, recordSet.name);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    static create(id, name) {
        return new Task(id, name);
    }
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Task = Task;
//# sourceMappingURL=itemBacklog.js.map