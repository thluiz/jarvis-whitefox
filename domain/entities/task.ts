
import { Activity } from "../entities";

export class Task {
    public static serialize(recordSet: any): Task {
        return Task.create(recordSet.id, recordSet.title,
            recordSet.projectId, recordSet.projectName,
            recordSet.complexity, recordSet.areaId,
            recordSet.areaName, recordSet.description,
            recordSet.evidences, recordSet.complexityDone,
            recordSet.activities ?
                recordSet.activities.map((a) => <Activity> a) : []);
    }

    public static serializeAll(recordSet: any): Task[] {
        return recordSet.map(this.serialize);
    }

    public static create(id: number, title: string, projectId: number, projectName: string,
                         complexity: number, areaId: number, areaName: string, description: string[],
                         evidences: string[], complexityDone: number, activities: Activity[]) {

        return new Task(id, title, projectId, projectName, complexity, areaId, areaName,
            description, evidences, complexityDone, activities);
    }

    public id: number;
    public title: string;
    public complexity: number;
    public complexityDone: number;
    public projectId: number;
    public projectName: string;
    public areaId: number;
    public areaName: string;
    public description: string[];
    public evidences: string[];
    public activities: Activity[];

    constructor(id: number, title: string, projectId: number, projectName: string,
                complexity: number, areaId: number, areaName: string, description: string[],
                evidences: string[], complexityDone: number, activities: Activity[]) {

        this.id = id;
        this.title = title;
        this.projectId = projectId;
        this.projectName = projectName;
        this.complexity = complexity;
        this.areaId = areaId;
        this.areaName = areaName;
        this.description = description;
        this.evidences = evidences;
        this.complexityDone = complexityDone;
        this.activities = activities;

    }
}
