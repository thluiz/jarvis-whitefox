/// <reference path="../typings/index.d.ts" />

import { IAddress } from "botbuilder";

class IdNameEntity {
    id: number;
    name: string;

    constructor(id: number, name?: string) {
        this.id = id;
        this.name = name;
    }

    static create(id: number, name?: string) {
        return new IdNameEntity(id, name);
    }
}


export class Project extends IdNameEntity {
    static serialize(recordSet: any): Project {
        return new Project(recordSet.Id, recordSet.Name);
    }

    static serializeAll(recordSet: any): Project[] {
        let projects: any[] = [];
        recordSet[0][0].forEach(p => {
            projects.push(Project.create(p.id, p.name));
        });

        return projects;
    }
}

export class ItemBacklog extends IdNameEntity {
    static serialize(recordSet: any): ItemBacklog {
        return new ItemBacklog(recordSet.Id, recordSet.Name);
    }

    static serializeAll(recordSet: any): ItemBacklog[] {
        let items: any[] = [];
        recordSet[0][0].forEach(p => {
            items.push(ItemBacklog.create(p.id, p.name));
        });

        return items;
    }
}

export class LoginRequest {
    token: string;
    securityId: number;
    address: IAddress;
    name: string;

    constructor(token: string, securityId: number, address: IAddress, name: string) {
        this.token = token;
        this.securityId = securityId;
        this.address = address;
        this.name = name;
    }

    static serialize(recordSet: any): LoginRequest {
        var data: any = recordSet[0][0];

        if (!data.success) {
            throw `Erro ao obter o login do usuário: ${data.message}`;
        }

        const token: string = data.providerKey;
        const securityId: number = data.userId;
        const name: string = data.name;
        const address: IAddress = <IAddress>JSON.parse(JSON.parse(data.details));

        return new LoginRequest(token, securityId, address, name);
    }
}

export class User {
    id: number;
    name: string;
    projects?: Project[];

    constructor(id: number, name: string, projects?: Project[]) {
        this.id = id;
        this.name = name;
        this.projects = projects;
    }

    static create(id: number, name: string, projects?: Project[]) {
        return new User(id, name, projects);
    }

    static serialize = function (recordset): User {
        const data: any = recordset[0][0];

        return User.create(data.id, data.name, data.projects);
    }
}