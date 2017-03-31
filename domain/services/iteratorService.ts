import to from "await-to-js";
import * as http from "http";
import { Result } from "../../domain/result";
import { Activity } from "../entities";
import * as Domain from "../entities";
import { List } from "../list";
import { IteratorBaseRepository } from "../repositories/iteratorBaseRepository";
import { SQLParameter } from "../sqlParameter";
import { IService } from "./service";

const IR = new IteratorBaseRepository();

export class IteratorService implements IService {

    public static async getUsersProjects(user: Domain.User): Promise<Result<Domain.Project[]>> {
        return IR.executeSP("GetUsersProjects",
            (rs) => { return Domain.Project.serializeAll(rs.results); },
            SQLParameter.Int("userId", user.id),
        );
    }

    public static async getProjectAreas(project: Domain.Project): Promise<Result<Domain.FeatureArea[]>> {
        return IR.executeSP("GetProjectAreas",
            (rs) => { return Domain.FeatureArea.serializeAll(rs.results); },
            SQLParameter.Int("projectId", project.id),
        );
    }

    public static async getTaskComplexities(user: Domain.User, task: Domain.Task): Promise<Result<Domain.Task>> {
        const result = task;

        const [err, complexities] = await to(IR.executeSP("GetTaskComplexities",
            (e) => { return e; },
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("taskId", task.id),
        ));

        if (err || !complexities.success) {
            return Result.Fail<Domain.Task>((err || complexities).message);
        }

        result.complexity = complexities.data.complexity;
        result.complexityDone = complexities.data.complexityDone;

        return Result.Ok(result);
    }

    public static async getTaskEvidences(user: Domain.User, task: Domain.Task): Promise<Result<Domain.Task>> {
        const result = task;

        const [err, evidences] = await to(IR.executeSP("GetTaskEvidences",
            (r) => { return r.results; },
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("taskId", task.id),
        ));

        if (err || !evidences.success) {
            return Result.Fail<Domain.Task>((err || evidences).message);
        }

        result.evidences = evidences.data ? evidences.data.map((m) => m.evidence) : [];

        return Result.Ok(result);
    }

    public static async getTaskDescriptions(user: Domain.User, task: Domain.Task): Promise<Result<Domain.Task>> {
        const result = task;

        const [err, descriptions] = await to(IR.executeSP("GetTaskDescriptions",
            (r) => { return r.results; },
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("taskId", task.id),
        ));

        if (err || !descriptions.success) {
            return Result.Fail<Domain.Task>((err || descriptions).message);
        }

        result.description = descriptions.data ? descriptions.data.map((m) => m.description) : [];

        return Result.Ok(result);
    }

    public static async getTaskActivities(user: Domain.User, task: Domain.Task): Promise<Result<Domain.Task>> {
        const result = task;

        const [err, activities] = await to(IR.executeSP("GetTaskActivities",
            (r) => { return Activity.serializeAll(r.results); },
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("taskId", task.id),
        ));

        if (err || !activities.success) {
            return Result.Fail<Domain.Task>((err || activities).message);
        }

        result.activities = activities.data;

        return Result.Ok(result);
    }

    public static convertComplexity2Number(complexity: string): number {
        const half = /(0.5|meio|meia|0\ .\ 5|0\,5|0\ \,\ 5)/;
        const one = /(1|um|uma)/;
        const two = /(2|dois|duas)/;
        const three = /(3|tres|três)/;
        const five = /(5|cinco)/;
        const eight = /(8|oito)/;
        const thirteen = /(13|treze)/;

        const parsed = parseInt(complexity, 10);

        if (half.test(complexity)) {
            return 0.5;
        }

        if (!isNaN(parsed)) {
            return parsed;
        }

        if (thirteen.test(complexity)) {
            return 13;
        }

        if (one.test(complexity)) {
            return 1;
        }

        if (two.test(complexity)) {
            return 2;
        }

        if (three.test(complexity)) {
            return 3;
        }

        if (five.test(complexity)) {
            return 5;
        }

        if (eight.test(complexity)) {
            return 8;
        }

        return 0;
    }

    public static async validateProjectForNewTask(user: Domain.User, projectId: number) {
        return IR.executeSPNoResult("ValidateProjectForNewItemBacklog",
            SQLParameter.Int("userId", user.id), SQLParameter.Int("projectId", projectId),
        );
    }

    public static async validateTaskForNewActivity(user: Domain.User, itemBacklogId: number) {
        return IR.executeSPNoResult("ValidateItemBacklogForNewActivity",
            SQLParameter.Int("userId", user.id), SQLParameter.Int("itemBacklogId", itemBacklogId),
        );
    }

    public static async search(user: Domain.User, onlyOwn: boolean,
                               projects: string[], billingCenters: string[],
                               locations: string[], text: string,
                               maxItens: number = 30): Promise<Result<any[]>> {

        return IR.executeSP("Search",
            (r) => { return r.results; },
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("maxItems", maxItens),
            SQLParameter.NVarCharMax("locations", locations.join(",")),
            SQLParameter.NVarCharMax("billingCenters", billingCenters.join(",")),
            SQLParameter.NVarCharMax("projects", projects.join(",")),
            SQLParameter.NVarChar("text", text, 180),
        );
    }

    public static async createActivity(user: Domain.User, taskId: number,
                                       title: string, complexity: number): Promise<Result<any>> {

        return IR.executeSPNoResult("CreateTask",
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("itemBacklogId", taskId),
            SQLParameter.Decimal("complexity", complexity, 3, 1),
            SQLParameter.NVarChar("title", title, 100),
        );
    }

    public static async createTask(user: Domain.User, project: Domain.Project,
                                   area: Domain.FeatureArea, title: string,
                                   complexity: number, description: string): Promise<Result<Domain.Task>> {

        let [err, taskResult] = await to(IR.executeSP("CreateItemBacklog",
            (rs) => { return <Domain.Task> { id: rs.id}; },
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("projectId", project.id),
            SQLParameter.Int("area", area ? area.id : 0),
            SQLParameter.Decimal("complexity", complexity, 3, 1),
            SQLParameter.NVarChar("title", title, 100),
            SQLParameter.NVarCharMax("description", description),
        ));

        if (err) {
            return Result.Fail<Domain.Task>(err.message);
        }

        return taskResult;
    }

    public static async updateIncidents(): Promise<Result<any>> {
        let options = {
            host: process.env.ITERATORSITE_URL,
            path: process.env.ITERATORSITE_UpdateIncidentsPath,
        };

        const [err, result] = await to(new Promise<Result<any>>((resolve) => {
            http.get(options, (res) => {
                if (res.statusCode === 200) {
                    resolve(Result.Ok());
                } else {
                    resolve(Result.Fail(`Error: ${res.statusCode}`));
                }
            }).on("error", (error) => {
                if (error) {
                    resolve(Result.Fail(err.message));
                }
            });
        }));

        if (err) {
            return Result.Fail(err.message);
        }

        return result;
    }
}
