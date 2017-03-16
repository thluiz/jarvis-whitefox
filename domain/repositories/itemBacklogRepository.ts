import { DataResult } from "../../support/result";
import { SQLParameter } from "./baseRepository";
import { IteratorBaseRepository } from "./iteratorBaseRepository";
import { ItemBacklog } from "../entities";

export class ItembacklogRepository extends IteratorBaseRepository {
    async search(token: string, projectId: number, title: string): Promise<DataResult<ItemBacklog[]>> {
        return this.executeSP("SearchItemBacklog",
            ItemBacklog.serializeAll,
            SQLParameter.NVarChar("token", token, 128),
            SQLParameter.Int("projectId", projectId),
            SQLParameter.NVarChar("title", title, 80)
        );
    }
}