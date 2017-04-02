import { CommandDialogs } from "./commandDialogs";
import { CommonTaskActionsDialogs } from "./commonTaskDialogs";
import { RegisterActivityDialogs } from "./registerActivityDialogs";
import { RegisterTaskDialogs } from "./registerTaskDialogs";
import { UserSpeedDialogs } from "./userSpeedDialogs";

// tslint:disable:max-classes-per-file
export class Commands extends CommandDialogs { }
export class RegisterActivity extends RegisterActivityDialogs { }
export class CommonTaskActions extends CommonTaskActionsDialogs { }
export class RegisterTask extends RegisterTaskDialogs { }
export class UserSpeed extends UserSpeedDialogs { }
