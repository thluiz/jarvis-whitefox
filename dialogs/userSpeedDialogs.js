"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const await_to_js_1 = require("await-to-js");
const builder = require("botbuilder");
const iteratorBaseRepository_1 = require("../domain/repositories/iteratorBaseRepository");
const userRepository_1 = require("../domain/repositories/userRepository");
const iteratorService_1 = require("../domain/services/iteratorService");
const IR = new iteratorBaseRepository_1.IteratorBaseRepository();
const UR = new userRepository_1.UserRepository();
const IS = new iteratorService_1.IteratorService();
class UserSpeedDialogs {
    setup(bot) {
        bot.dialog("/getUserByName", [(session, args, next) => {
                session.dialogData.user = {};
                if (args && args.user) {
                    session.dialogData.user = args.user;
                }
                if (session.dialogData.user.name && session.dialogData.user.name.length >= 3) {
                    next();
                    return;
                }
                else {
                    builder.Prompts.text(session, !args || !args.retry ?
                        "Por favor, poderia informar o nome do usuário?"
                        : "Poderia informar ao menos 3 caracteres do nome do usuário?");
                }
            }, (session, results) => __awaiter(this, void 0, void 0, function* () {
                if (results.response && results.response.length <= 3) {
                    session.replaceDialog("/getUserByName", { user: session.dialogData.user, retry: true });
                    return;
                }
                if (results.response) {
                    session.dialogData.user.name = results.response;
                }
                const [err, userData] = yield await_to_js_1.default(UR.getUserByName(session.dialogData.user.name));
                if (err || !userData.success) {
                    session.endDialog(`Ocorreu o seguinte erro ao procurar o usuário ${(err || userData).message}`);
                    return;
                }
                if (userData.data.length === 0) {
                    session.endConversation(`Nenhum usuário encontrado!`);
                    return;
                }
                if (userData.data.length === 1) {
                    session.endDialogWithResult({ response: { user: userData.data[0] } });
                    return;
                }
                session.dialogData.users = userData.data;
                let options = [];
                session.dialogData.users.forEach((u) => {
                    options[options.length] = u.name;
                });
                builder.Prompts.choice(session, "Encontrei vários usuários com esse nome, qual seria?", options, { listStyle: builder.ListStyle.button });
            }),
            (session, results, next) => __awaiter(this, void 0, void 0, function* () {
                session.dialogData.users.foreach((u) => {
                    if (u.name === results.response.entity) {
                        session.dialogData.user = u;
                    }
                });
                session.endDialogWithResult({ response: { user: session.dialogData.user } });
            })]);
    }
}
exports.UserSpeedDialogs = UserSpeedDialogs;
//# sourceMappingURL=userSpeedDialogs.js.map