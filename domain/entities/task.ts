
export class Task {
    public static serialize(recordSet: any): Task {
        return Task.create(recordSet.id, recordSet.title,
                            recordSet.projectId, recordSet.projectName,
                            recordSet.complexity);
    }

    public static serializeAll(recordSet: any): Task[] {
        return recordSet.map(this.serialize);
    }

    public static create(id: number, title: string, projectId: number, projectName: string, complexity:number) {
        return new Task(id, title, projectId, projectName, complexity);
    }

    public id: number;
    public title: string;
    public complexity: number;
    public projectId: number;
    public projectName: string;

    constructor(id: number, title: string, projectId: number, projectName: string, complexity: number) {
        this.id = id;
        this.title = title;
        this.projectId = projectId;
        this.projectName = projectName;
        this.complexity = complexity;
    }
}
