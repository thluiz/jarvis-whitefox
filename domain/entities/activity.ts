import { Task } from "./itemBacklog";

export class Activity {
    public id: number;
    public title: string;
    public complexity: number;
    public taskId: number;

    constructor(id: number, title: string, complexity: number, taskId: number) {
        this.id = id;
        this.title = title;
        this.complexity = complexity;
        this.taskId = taskId;
    }
}
