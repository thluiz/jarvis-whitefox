import { DataResult } from "../../support/result";
import { SQLParameter } from "./baseRepository";
import { IteratorBaseRepository } from "./iteratorBaseRepository";
import { Project, User } from "../entities";

export class ProjectRepository extends IteratorBaseRepository {
    async getProjects(user: User): Promise<DataResult<Project[]>> {
        return await this.executeSP("GetUserProjects",
            Project.serializeAll,
            SQLParameter.Int("userId", user.id));
    }
}