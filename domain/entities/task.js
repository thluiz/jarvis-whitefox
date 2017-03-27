"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    static serialize(recordSet) {
        return Task.create(recordSet.id, recordSet.title, recordSet.projectId, recordSet.projectName, recordSet.complexity, recordSet.areaId, recordSet.areaName, recordSet.description, recordSet.evidences, recordSet.complexityDone, recordSet.activities ?
            recordSet.activities.map((a) => a) : []);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    static create(id, title, projectId, projectName, complexity, areaId, areaName, description, evidences, complexityDone, activities) {
        return new Task(id, title, projectId, projectName, complexity, areaId, areaName, description, evidences, complexityDone, activities);
    }
    constructor(id, title, projectId, projectName, complexity, areaId, areaName, description, evidences, complexityDone, activities) {
        this.id = id;
        this.title = title;
        this.projectId = projectId;
        this.projectName = projectName;
        this.complexity = complexity;
        this.areaId = areaId;
        this.areaName = areaName;
        this.description = description;
        this.evidences = evidences;
        this.complexityDone = complexityDone;
        this.activities = activities;
    }
}
exports.Task = Task;
//# sourceMappingURL=task.js.map