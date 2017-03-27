import { DetailTaskIntents } from "./detailTaskIntents";
import { GeneralIntents } from "./generalIntents";
import { GenerateDocumentIntents } from "./generateDocumentIntents";
import { HelpIntents } from "./helpIntents";
import { ProjectPaceIntents } from "./projectPaceIntents";
import { QueryIntents } from "./queryIntents";
import { QueryTaskIntents } from "./queryTaskIntents";
import { RegisterActivityIntents } from "./registerActivityIntents";
import { RegisterTaskIntents } from "./registerTaskIntents";
import { UpdateTaskIntents } from "./updateTaskIntents";
import { UserPaceIntents } from "./userPaceIntents";

// tslint:disable:max-classes-per-file
export class General extends GeneralIntents { }
export class DetailTask extends DetailTaskIntents { }
export class GenerateDocument extends GenerateDocumentIntents { }
export class Help extends HelpIntents { }
export class ProjectPace extends ProjectPaceIntents { }
export class Query extends QueryIntents { }
export class QueryTask extends QueryTaskIntents { }
export class RegisterActivity extends RegisterActivityIntents { }
export class RegisterTask extends RegisterTaskIntents { }
export class UpdateTask extends UpdateTaskIntents { }
export class UserPace extends UserPaceIntents { }
