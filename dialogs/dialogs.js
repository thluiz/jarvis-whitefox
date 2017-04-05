"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandDialogs_1 = require("./commandDialogs");
const registerActivityDialogs_1 = require("./registerActivityDialogs");
const taskDialogs_1 = require("./taskDialogs");
const userDialogs_1 = require("./userDialogs");
// tslint:disable:max-classes-per-file
class Commands extends commandDialogs_1.CommandDialogs {
}
exports.Commands = Commands;
class RegisterActivity extends registerActivityDialogs_1.RegisterActivityDialogs {
}
exports.RegisterActivity = RegisterActivity;
class Task extends taskDialogs_1.TaskDialogs {
}
exports.Task = Task;
class UserSpeed extends userDialogs_1.UserDialogs {
}
exports.UserSpeed = UserSpeed;
//# sourceMappingURL=dialogs.js.map