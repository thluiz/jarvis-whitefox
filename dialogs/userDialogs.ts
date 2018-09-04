import to from "await-to-js";
import * as builder from "botbuilder";
import { Task, User } from "../domain/entities";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { UserRepository } from "../domain/repositories/userRepository";
import { Result } from "../domain/result";
import { IteratorService } from "../domain/services/iteratorService";
import { SecurityService } from "../domain/services/SecurityService";
import { IDialogBase } from "./dialogBase";

const IR = new IteratorBaseRepository();
const UR = new UserRepository();
const IS = new IteratorService();

export class UserDialogs implements IDialogBase {
    public setup(bot: builder.UniversalBot): void {
        bot.dialog("/getUserByName", [(session, args, next) => {
            session.dialogData.user = {};
            if (args && args.user) {
                session.dialogData.user = args.user;
            }

            if (session.dialogData.user.name && session.dialogData.user.name.length >= 3) {
                next();
                return;
            } else {
                builder.Prompts.text(session, !args || !args.retry ?
                    "Por favor, poderia informar o nome do usuário?"
                    : "Poderia informar ao menos 3 caracteres do nome do usuário?");
            }
        }, async (session, results) => {
            if (results.response && results.response.length <= 3) {
                session.replaceDialog("/getUserByName",
                    { user: session.dialogData.user, retry: true });
                return;
            }

            if (results.response) {
                session.dialogData.user.name = results.response;
            }

            const [err, userData] = await to(UR.getUserByName(session.dialogData.user.name));

            if (err || !userData.success) {
                session.endConversation(`Ocorreu o seguinte erro ao procurar o usuário ${(err || userData).message}`);
                return;
            }

            if (userData.data.length === 0) {
                session.endConversation(`Nenhum usuário encontrado!`);
                return;
            }

            if (userData.data.length === 1) {
                session.endDialogWithResult({response: { user:  userData.data[0]}});
                return;
            }

            session.dialogData.users = userData.data as User[];
            const options = [];

            session.dialogData.users.forEach((u: User) => {
                options[options.length] = u.name;
            });

            builder.Prompts.choice(session, "Encontrei vários usuários com esse nome, qual seria?", options,
                    { listStyle: builder.ListStyle.button });
        },
        async (session, results, next) => {
            session.dialogData.users.foreach((u: User) => {
                if (u.name === results.response.entity) {
                    session.dialogData.user = u;
                }
            });

            session.endDialogWithResult({ response: { user: session.dialogData.user} });
        }],
        );
    }
}
