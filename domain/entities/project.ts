export class Project {
    public static serialize(recordSet: any): Project {
        return new Project(recordSet.Id, recordSet.Name);
    }

    public static serializeAll(recordSet: any): Project[] {
        let projects: any[] = [];
        recordSet[0][0].forEach(p => {
            projects.push(Project.create(p.id, p.name));
        });

        return projects;
    }

    public static create(id: number, name: string) {
        return new Project(id, name);
    }

    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
