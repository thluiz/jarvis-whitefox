import { GeneralIntents } from "./generalIntents";
import { GenerateDocumentIntents } from "./generateDocumentIntents";
import { HelpIntents } from "./helpIntents";
import { QueryIntents } from "./queryIntents";
import { RegisterActivityIntents } from "./registerActivityIntents";
import { RegisterTaskIntents } from "./registerTaskIntents";

// tslint:disable:max-classes-per-file
export class General extends GeneralIntents { }
export class GenerateDocument extends GenerateDocumentIntents { }
export class Help extends HelpIntents { }
export class RegisterActivity extends RegisterActivityIntents { }
export class RegisterTask extends RegisterTaskIntents { }
export class Query extends QueryIntents { }
