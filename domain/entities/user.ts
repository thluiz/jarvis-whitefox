import { Project } from "./project";

export class User {

    public static create(id: number, name: string) {
        return new User(id, name);
    }

    public static serialize(recordset): User {
        return User.create(recordset.id, recordset.name);
    }

    public static serializeAll(recordSet: any): User[] {
        if (!recordSet.results || recordSet.results.length === 0) {
            return [];
        }
        return recordSet.results.map(User.serialize);
    }

    public id: number;
    public name: string;
    public projects?: Project[];

    constructor(id: number, name: string, projects?: Project[]) {
        this.id = id;
        this.name = name;
        this.projects = projects;
    }
}
