import { Result } from "../../domain/result";
import { Project, User } from "../entities";
import { SQLParameter } from "../sqlParameter";
import { IteratorBaseRepository } from "./iteratorBaseRepository";

export class ProjectRepository extends IteratorBaseRepository {
    public async getProjects(user: User): Promise<Result<Project[]>> {
        return await this.executeSP("GetUserProjects",
            Project.serializeAll,
            SQLParameter.Int("userId", user.id));
    }
}