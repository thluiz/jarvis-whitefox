"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Project {
    static serialize(recordSet) {
        return new Project(recordSet.Id, recordSet.Name);
    }
    static serializeAll(recordSet) {
        let projects = [];
        recordSet[0][0].forEach(p => {
            projects.push(Project.create(p.id, p.name));
        });
        return projects;
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