export class Activity {
    public static serialize(recordSet: any): Activity {
        return new Activity(recordSet.id, recordSet.title, recordSet.complexity,
            recordSet.itemBacklogId, recordSet.itemBacklogTitle, recordSet.projectName,
            recordSet.userName);
    }

    public static serializeAll(recordSet: any): Activity[] {
        return recordSet.map(this.serialize);
    }

    public id: number;
    public title: string;
    public complexity: number;
    public taskId: number;
    public taskName: string;
    public project: string;
    public userName: string;

    constructor(id: number, title: string, complexity: number, taskId: number,
                taskName: string, project: string, userName: string) {

        this.id = id;
        this.title = title;
        this.complexity = complexity;
        this.taskId = taskId;
        this.taskName = taskName;
        this.project = project;
        this.userName = userName;

    }
}
