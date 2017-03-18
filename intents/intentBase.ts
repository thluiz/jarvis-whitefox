import { IntentDialog } from "botbuilder";

export interface IIntentBase {
    setup(dialog: IntentDialog): void;
}
