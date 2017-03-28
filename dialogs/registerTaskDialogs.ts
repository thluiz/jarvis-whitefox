import to from "await-to-js";
import * as builder from "botbuilder";
import { Task } from "../domain/entities";
import { IteratorBaseRepository } from "../domain/repositories/iteratorBaseRepository";
import { Result } from "../domain/result";
import { IteratorService } from "../domain/services/iteratorService";
import { SecurityService } from "../domain/services/SecurityService";
import { IDialogBase } from "./dialogBase";

const IR = new IteratorBaseRepository();
const IS = new IteratorService();

export class RegisterTaskDialogs implements IDialogBase {

    public setup(bot: builder.UniversalBot): void {
        //
    }
}
