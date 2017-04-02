"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandDialogs_1 = require("./commandDialogs");
const commonTaskDialogs_1 = require("./commonTaskDialogs");
const registerActivityDialogs_1 = require("./registerActivityDialogs");
const registerTaskDialogs_1 = require("./registerTaskDialogs");
const userSpeedDialogs_1 = require("./userSpeedDialogs");
// tslint:disable:max-classes-per-file
class Commands extends commandDialogs_1.CommandDialogs {
}
exports.Commands = Commands;
class RegisterActivity extends registerActivityDialogs_1.RegisterActivityDialogs {
}
exports.RegisterActivity = RegisterActivity;
class CommonTaskActions extends commonTaskDialogs_1.CommonTaskActionsDialogs {
}
exports.CommonTaskActions = CommonTaskActions;
class RegisterTask extends registerTaskDialogs_1.RegisterTaskDialogs {
}
exports.RegisterTask = RegisterTask;
class UserSpeed extends userSpeedDialogs_1.UserSpeedDialogs {
}
exports.UserSpeed = UserSpeed;
//# sourceMappingURL=dialogs.js.map