"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    static serialize(recordSet) {
        return Task.create(recordSet.id, recordSet.title, recordSet.projectId, recordSet.projectName, recordSet.complexity);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    static create(id, title, projectId, projectName, complexity) {
        return new Task(id, title, projectId, projectName, complexity);
    }
    constructor(id, title, projectId, projectName, complexity) {
        this.id = id;
        this.title = title;
        this.projectId = projectId;
        this.projectName = projectName;
        this.complexity = complexity;
    }
}
exports.Task = Task;
//# sourceMappingURL=task.js.map