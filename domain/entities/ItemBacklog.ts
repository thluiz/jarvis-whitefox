
export class Task {
    public static serialize(recordSet: any): Task {
        return Task.create(recordSet.id, recordSet.name);
    }

    public static serializeAll(recordSet: any): Task[] {
        return recordSet.map(this.serialize);
    }

    public static create(id: number, name: string) {
        return new Task(id, name);
    }

    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
