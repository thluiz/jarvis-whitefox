import { Result } from "../../domain/result";
import { ItemBacklog } from "../entities";
import { SQLParameter } from "../sqlParameter";
import { IteratorBaseRepository } from "./iteratorBaseRepository";

export class ItembacklogRepository extends IteratorBaseRepository {
    public async load(itemBacklogId: number): Promise<Result<ItemBacklog>> {
        const result: Result<ItemBacklog> = await this.executeSP("GetItemBacklogData",
            ItemBacklog.serialize,
            SQLParameter.Int("itemBacklogId", itemBacklogId));

        if (!result.success) {
            return result;
        }

        return Result.Ok(result.data);
    }
}
