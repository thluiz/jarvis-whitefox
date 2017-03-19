export class Project {
    public static serialize(recordSet: any): Project {
        return Project.create(recordSet.id, recordSet.name);
    }

    public static serializeAll(recordSet: any): Project[] {
        return recordSet.map(this.serialize);
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
