import { GeneralIntents } from "./generalIntents";
import { GenerateDocumentIntents } from "./generateDocumentIntents";
import { HelpIntents } from "./helpIntents";
import { RegisterActivityIntents } from "./registerActivityIntents";
import { RegisterTaskIntents } from "./registerTaskIntents";
import { SearchIntents } from "./searchIntents";

// tslint:disable:max-classes-per-file
export class General extends GeneralIntents { }
export class GenerateDocument extends GenerateDocumentIntents { }
export class Help extends HelpIntents { }
export class RegisterActivity extends RegisterActivityIntents { }
export class RegisterTask extends RegisterTaskIntents { }
export class Search extends SearchIntents { }
