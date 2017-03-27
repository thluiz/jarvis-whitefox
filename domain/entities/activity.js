"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Activity {
    static serialize(recordSet) {
        return new Activity(recordSet.id, recordSet.title, recordSet.complexity, recordSet.itemBacklogId, recordSet.itemBacklogTitle, recordSet.projectName, recordSet.userName);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    constructor(id, title, complexity, taskId, taskName, project, userName) {
        this.id = id;
        this.title = title;
        this.complexity = complexity;
        this.taskId = taskId;
        this.taskName = taskName;
        this.project = project;
        this.userName = userName;
    }
}
exports.Activity = Activity;
//# sourceMappingURL=activity.js.map