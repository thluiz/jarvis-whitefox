"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    static create(id, name) {
        return new User(id, name);
    }
    static serialize(recordset) {
        return User.create(recordset.id, recordset.name);
    }
    static serializeAll(recordSet) {
        return recordSet.results.map(User.serialize);
    }
    constructor(id, name, projects) {
        this.id = id;
        this.name = name;
        this.projects = projects;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map