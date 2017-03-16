/// <reference path="../typings/index.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdNameEntity {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static create(id, name) {
        return new IdNameEntity(id, name);
    }
}
class Project extends IdNameEntity {
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
}
exports.Project = Project;
class ItemBacklog extends IdNameEntity {
    static serialize(recordSet) {
        return new ItemBacklog(recordSet.Id, recordSet.Name);
    }
    static serializeAll(recordSet) {
        let items = [];
        recordSet[0][0].forEach(p => {
            items.push(ItemBacklog.create(p.id, p.name));
        });
        return items;
    }
}
exports.ItemBacklog = ItemBacklog;
class LoginRequest {
    constructor(token, securityId, address, name) {
        this.token = token;
        this.securityId = securityId;
        this.address = address;
        this.name = name;
    }
    static serialize(recordSet) {
        var data = recordSet[0][0];
        if (!data.success) {
            throw `Erro ao obter o login do usuário: ${data.message}`;
        }
        const token = data.providerKey;
        const securityId = data.userId;
        const name = data.name;
        const address = JSON.parse(JSON.parse(data.details));
        return new LoginRequest(token, securityId, address, name);
    }
}
exports.LoginRequest = LoginRequest;
class User {
    constructor(id, name, projects) {
        this.id = id;
        this.name = name;
        this.projects = projects;
    }
    static create(id, name, projects) {
        return new User(id, name, projects);
    }
}
User.serialize = function (recordset) {
    const data = recordset[0][0];
    return User.create(data.id, data.name, data.projects);
};
exports.User = User;
//# sourceMappingURL=entities.js.map