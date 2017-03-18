import { UniversalBot } from "botbuilder";

export interface IDialogBase {
    setup(bot: UniversalBot): void;
}
