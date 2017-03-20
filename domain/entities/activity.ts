export class Activity {
    public id: number;
    public title: string;
    public complexity: number;
    public taskId: number;
    public taskName: string;

    constructor(id: number, title: string, complexity: number, taskId: number, taskName: string) {
        this.id = id;
        this.title = title;
        this.complexity = complexity;
        this.taskId = taskId;
        this.taskName = taskName;
    }
}
