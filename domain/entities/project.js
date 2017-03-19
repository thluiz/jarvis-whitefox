"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Project {
    static serialize(recordSet) {
        return Project.create(recordSet.id, recordSet.name);
    }
    static serializeAll(recordSet) {
        return recordSet.map(this.serialize);
    }
    static create(id, name) {
        return new Project(id, name);
    }
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Project = Project;
//# sourceMappingURL=project.js.map