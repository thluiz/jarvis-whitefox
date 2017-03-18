import { Result } from "../../support/result";
import * as Domain from "../entities";
import { List } from "../list";
import { IteratorBaseRepository } from "../repositories/iteratorBaseRepository";
import { SQLParameter } from "../sqlParameter";
import { IService } from "./iservice";

const IR = new IteratorBaseRepository();

export class IteratorService implements IService {

    // tslint:disable-next-line:max-line-length
    public static async SearchItemBackLog(user: Domain.User, title: string, maxItens: number): Promise<Result<List<Domain.ItemBacklog>>> {

        let serialize = (recordset: any) => {
            let ib = new List<Domain.ItemBacklog>();
            let items = [];

            recordset[0][0].items.forEach((el) => {
                items.push(new Domain.ItemBacklog(el.id, el.name));
            });

            ib.totalCount = recordset[0][0].total;
            ib.items = items;
            return ib;
        };

        return IR.executeSP("SearchItemBacklog",
            serialize,
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("maxItens", maxItens),
            SQLParameter.NVarChar("title", title, 180),
        );
    }

    public static async createTask(user: Domain.User, itemBacklog: Domain.ItemBacklog,
                                   title: string, complexity: number): Promise<Result<any>> {

        return IR.executeSPNoResult("CreateTask",
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("itemBacklogId", itemBacklog.id),
            SQLParameter.Decimal("complexity", complexity, 3, 1),
            SQLParameter.NVarChar("title", title, 180),
        );
    }
}