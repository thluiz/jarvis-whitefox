"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    static create(id, name, projects) {
        return new User(id, name, projects);
    }
    static serialize(recordset) {
        const data = recordset[0][0];
        return User.create(data.id, data.name, data.projects);
    }
    constructor(id, name, projects) {
        this.id = id;
        this.name = name;
        this.projects = projects;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map