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
const userRepository_1 = require("../domain/repositories/userRepository");
const intentBase_1 = require("./intentBase");
const intentEntities_1 = require("./intentEntities");
const service_1 = require("../domain/services/service");
const IE = new intentEntities_1.IntentEntities();
const UR = new userRepository_1.UserRepository();
const ownSpeed = /^(meu|minha)/;
const greensmiles = ["(hearteyes)", "(cool)", ":o", "(rock)", "(like)", "(joy)"];
const yellowsmiles = [":)", ";)", ":|", ":P", ":^)", "|(", "(mm)", "(whew)", "(smirk)"];
const redsmiles = ["(shock)", "(cold)", ":(", ":@", ":S", "(waiting), (sadness)",
    "(wtf)", "(slap)", "(computerrage)", "(gottarun)"];
const fullgoal = ["(penguin)", "(party)", "(celebrate)", "(victory)"];
class UserSpeedIntents extends intentBase_1.IntentBase {
    setup(dialog) {
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
            }, (session, results) => __awaiter(this, void 0, void 0, function* () {
                if (results && results.response) {
                    session.dialogData.user = results.response.user;
                }
                session.sendTyping();
                const [err, speed] = yield await_to_js_1.default(UR.getUserSpeed(session.dialogData.user));
                if (err || !speed.success) {
                    session.endConversation(`Ocorreu o seguinte erro ao obter a velocidade: ${(err || speed).message}`);
                    return;
                }
                let msg = "";
                for (let g of speed.data.goals) {
                    const goal = g;
                    if (goal.Goal === goal.ClosedComplexity) {
                        msg += `${service_1.UtilsService.getRandomItemFromArray(fullgoal)} `;
                    }
                    else if (goal.Speed === 0) {
                        msg += `${service_1.UtilsService.getRandomItemFromArray(greensmiles)} `;
                    }
                    else if (goal.Speed === 1) {
                        msg += `${service_1.UtilsService.getRandomItemFromArray(redsmiles)} `;
                    }
                    else if (goal.Speed === 2) {
                        msg += `${service_1.UtilsService.getRandomItemFromArray(yellowsmiles)} `;
                    }
                    msg += ` **${goal.Entity}** :\n\n`;
                    if (goal.MediaDiasFaltantes > goal.MediaDias) {
                        msg += `* Média: **${goal.MediaDiasFaltantes}** (${goal.MediaDias.toFixed(2)});\n`;
                    }
                    else {
                        msg += `* Média: ${goal.MediaDiasFaltantes} (${goal.MediaDias.toFixed(2)}); \n`;
                    }
                    if (goal.Estimated < 0) {
                        msg += `* Devendo: **${-goal.Estimated}**; \n`;
                    }
                    else {
                        msg += `* Adiantado: ${goal.Estimated}; \n`;
                    }
                    msg += `* Realizada: ${goal.ClosedComplexity}; \n` +
                        `* Meta: ${goal.Goal}; \n` +
                        "\n\n ";
                }
                session.endDialog(msg);
            }),
        ]);
    }
}
exports.UserSpeedIntents = UserSpeedIntents;
//# sourceMappingURL=userSpeedIntents.js.map