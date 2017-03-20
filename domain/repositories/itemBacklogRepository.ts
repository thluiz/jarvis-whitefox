import { Result } from "../../domain/result";
import { Task } from "../entities";
import { SQLParameter } from "../sqlParameter";
import { IteratorBaseRepository } from "./iteratorBaseRepository";

export class ItembacklogRepository extends IteratorBaseRepository {
    public async load(itemBacklogId: number): Promise<Result<Task>> {
        const result: Result<Task> = await this.executeSP("GetItemBacklogData",
            Task.serialize,
            SQLParameter.Int("itemBacklogId", itemBacklogId));

        if (!result.success) {
            return result;
        }

        return Result.Ok(result.data);
    }
}
