import * as http from "http";
import { Result } from "../../domain/result";
import * as Domain from "../entities";
import { List } from "../list";
import { IteratorBaseRepository } from "../repositories/iteratorBaseRepository";
import { SQLParameter } from "../sqlParameter";
import { IService } from "./service";

const IR = new IteratorBaseRepository();

export class IteratorService implements IService {

    public static convertComplexity2Number(complexity: string): number {
        const half = /(0.5|meio|meia|0\ .\ 5)/;
        const one = /(1|um|uma)/;
        const two = /(2|dois|duas)/;
        const three = /(3|tres|três)/;

        if (half.test(complexity)) {
            return 0.5;
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

        return 0;
    }

    public static async ValidateProjectForNewTask(user: Domain.User, projectId: number) {
        return IR.executeSPNoResult("ValidateProjectForNewItemBacklog",
            SQLParameter.Int("userId", user.id), SQLParameter.Int("projectId", projectId),
        );
    }

    public static async ValidateTaskForNewActivity(user: Domain.User, itemBacklogId: number) {
        return IR.executeSPNoResult("ValidateItemBacklogForNewActivity",
            SQLParameter.Int("userId", user.id), SQLParameter.Int("itemBacklogId", itemBacklogId),
        );
    }

    public static async SearchItemBackLog(user: Domain.User,
        title: string, maxItens: number): Promise<Result<List<Domain.Task>>> {

        let serialize = (recordset: any) => {
            let ib = new List<Domain.Task>();

            ib.totalCount = recordset.total;
            ib.items = recordset.items.map(Domain.Task.serialize);
            return ib;
        };

        return IR.executeSP("SearchItemBacklog",
            serialize,
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("maxItens", maxItens),
            SQLParameter.NVarChar("title", title, 180),
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

    public static async updateIncidents(): Promise<Result<any>> {
        let options = {
            host: process.env.ITERATORSITE_URL,
            path: process.env.ITERATORSITE_UpdateIncidentsPath,
        };

        const result = await new Promise<Result<any>>((resolve) => {
            http.get(options, (res) => {
                if (res.statusCode === 200) {
                    resolve(Result.Ok());
                } else {
                    resolve(Result.Fail(`Error: ${res.statusCode}`));
                }
            }).on("error", (err) => {
                if (err) {
                    resolve(Result.Fail(err.message));
                }
            });
        });

        return result;
    }
}
