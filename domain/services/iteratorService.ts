/// <reference path="../../typings/index.d.ts" />

import { Service } from "./Service";
import { DataResult } from "../../support/result";
import { SQLParameter } from "../repositories/baseRepository";
import { IteratorBaseRepository } from "../repositories/iteratorBaseRepository";
import * as Domain from "../entities";

export class ItemBacklogListWithTotalCount {
    totalCount: number;
    items: Domain.ItemBacklog[];

    static serialize(recordset: any): ItemBacklogListWithTotalCount {
        let ib: ItemBacklogListWithTotalCount = new ItemBacklogListWithTotalCount();
        let items: Domain.ItemBacklog[] = [];

        recordset[0][0].items.forEach(el => {
            items.push(new Domain.ItemBacklog(el.id, el.name));
        });

        ib.totalCount = recordset[0][0].total;
        ib.items = items;
        return ib;
    }
}

export class IteratorService implements Service {
    static async SearchItemBackLog(user: Domain.User, title: string, maxItens: number): Promise<DataResult<ItemBacklogListWithTotalCount>> {
        const IR: IteratorBaseRepository = new IteratorBaseRepository();

        return IR.executeSP("SearchItemBacklog",
            ItemBacklogListWithTotalCount.serialize,
            SQLParameter.Int("userId", user.id),
            SQLParameter.Int("maxItens", maxItens),
            SQLParameter.NVarChar("title", title, 180)
        );
    }

}