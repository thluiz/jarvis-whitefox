import { Project } from "./project"

export class User {

    public static create(id: number, name: string, projects?: Project[]) {
        return new User(id, name, projects);
    }

    public static serialize(recordset): User {
        const data: any = recordset[0][0];

        return User.create(data.id, data.name, data.projects);
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
