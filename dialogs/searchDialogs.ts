import * as builder from "botbuilder";
import { IteratorService } from "../domain/services/service";
import { IDialogBase } from "./dialogBase";

export class SaearchDialogs implements IDialogBase {
    public setup(bot: builder.UniversalBot): void {
        bot.dialog("/searchItembacklog", [
            (session: builder.Session, results: any, next: Function) =>  {
                builder.Prompts.text(session, "Poderia informar parte do nome da tarefa?");
            },
            async (session: builder.Session, results: any) => {
                const title: string = results.response;
                const maxItens: number = 5;
                const titleMinLength: number = 5;

                if (title.length >= titleMinLength) {
                    session.sendTyping();
                    let result = await IteratorService.SearchItemBackLog(
                        session.userData.user, title, maxItens
                    );

                    if (!result.success) {
                        session.endDialog(`Ops! aconteceu o erro ${result.message}`);
                        return;
                    }
                    const data = result.data;
                    if (data.items.length < data.totalCount) {
                        session.send(`Hum... encontrei ${data.totalCount} registros, mas não tem problema.`);
                        session.send(`Aqui vão os ${maxItens} mais recentes:`);
                    }
                    let list: string = "";
                    data.items.forEach(el => {
                        list += (`  ${el.id} - ${el.name} \n\n`);
                    });

                    session.send(list);
                    session.endDialog();
                } else {
                    // tslint:disable-next-line:max-line-length
                    session.send(`Assim você vai me dar muito trabalho, informe ao menos ${titleMinLength} caracteres para eu procurar.`);
                    session.replaceDialog("/searchItembacklog");
                }
            }],
        );
    }
}
