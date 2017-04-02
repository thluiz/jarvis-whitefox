import to from "await-to-js";
import * as builder from "botbuilder";
import { UserRepository } from "../domain/repositories/userRepository";
import { IntentBase } from "./intentBase";
import { IntentEntities } from "./intentEntities";
import { UtilsService } from "../domain/services/service";

const IE = new IntentEntities();
const UR = new UserRepository();
const ownSpeed = /^(meu|minha)/;

const greensmiles = ["(hearteyes)", "(cool)", ":o", "(rock)", "(like)", "(joy)"];
const yellowsmiles = [":)", ";)", ":|", ":P", ":^)", "|(", "(mm)", "(whew)", "(smirk)"];
const redsmiles = ["(shock)", "(cold)", ":(", ":@", ":S", "(waiting), (sadness)",
    "(wtf)", "(slap)", "(computerrage)", "(gottarun)"];

const fullgoal = ["(penguin)", "(party)", "(celebrate)", "(victory)"];

interface IGoal {
    Entity: string;
    Estimated: number;
    ClosedComplexity: number;
    Speed: number;
    Goal: number;
    MediaDiasFaltantes: number;
    MediaDias: number;
}

export class UserSpeedIntents extends IntentBase {
    public setup(dialog: builder.IntentDialog): void {
        dialog.matches("user_speed", [
            (session, args, next) => {

                if (!session.userData.user
                    || !session.userData.user.id
                    || session.userData.user.id <= 0) {
                    session.send("Antes de verificar velocidades precisamos ter certeza de quem é você." +
                        "Depois que você logar poderemos continuar, ok?");
                    session.replaceDialog("/profile");
                    return;
                }

                const userName = builder.EntityRecognizer.findEntity(args.entities, IE.User);

                if (!userName || !userName.entity || userName.entity.length < 3) {
                    session.beginDialog("/getUserByName");
                    return;
                }

                if (ownSpeed.test(userName.entity)) {
                    session.dialogData.user = session.userData.user;
                    next();
                    return;
                }

                session.beginDialog("/getUserByName", { user: { name: userName.entity } });
            }, async (session, results) => {
                if (results && results.response) {
                    session.dialogData.user = results.response.user;
                }

                session.sendTyping();
                const [err, speed] = await to(UR.getUserSpeed(session.dialogData.user));
                if (err || !speed.success) {
                    session.endConversation(`Ocorreu o seguinte erro ao obter a velocidade: ${(err || speed).message}`);
                    return;
                }

                let msg = "";

                for (let g of speed.data.goals) {
                    const goal = <IGoal>g;

                    if (goal.Goal === goal.ClosedComplexity) {
                        msg += `${UtilsService.getRandomItemFromArray(fullgoal)} `;
                    } else if (goal.Speed === 0) {
                        msg += `${UtilsService.getRandomItemFromArray(greensmiles)} `;
                    } else if (goal.Speed === 1) {
                        msg += `${UtilsService.getRandomItemFromArray(redsmiles)} `;
                    } else if (goal.Speed === 2) {
                        msg += `${UtilsService.getRandomItemFromArray(yellowsmiles)} `;
                    }

                    msg += ` **${goal.Entity}** :\n\n`;

                    msg += `* Média Esperada: ${goal.MediaDiasFaltantes}; \n\n`;

                    if (goal.Estimated < 0) {
                        msg += `* Estimativa: **${-goal.Estimated}**; \n\n`;
                    } else {
                        msg += `* Estimativa: ${goal.Estimated}; \n\n`;
                    }

                    msg += `* Realizada: ${goal.ClosedComplexity}; \n\n` +
                        `* Meta: ${goal.Goal}; \n\n` +
                        "\n\n \n\n";
                }

                session.endDialog(msg);
            },
        ]);
    }
}
