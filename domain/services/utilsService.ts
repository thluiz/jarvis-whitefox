import { sprintf } from "sprintf-js";
import { IService } from "./service";
import { FunnyMessages } from "./templates/funnyMessages";

export interface IFormattingOptions {
    withDashs: boolean;
    withDots: boolean;
    withSlashs: boolean;
    withFluffy: boolean;
}

export class UtilsService implements IService {
    public static randomNumber(n): number {
        return Math.round(Math.random() * n);
    }

    public static randomString(length = 13): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    // tslint:disable-next-line:max-line-length
    public static generateCNPJ(formatting: IFormattingOptions = { withDashs: true, withSlashs: true, withDots: true, withFluffy: false }): string {
        let n = 9;
        let n1 = this.randomNumber(n);
        let n2 = this.randomNumber(n);
        let n3 = this.randomNumber(n);
        let n4 = this.randomNumber(n);
        let n5 = this.randomNumber(n);
        let n6 = this.randomNumber(n);
        let n7 = this.randomNumber(n);
        let n8 = this.randomNumber(n);
        let n9 = 0;
        let n10 = 0;
        let n11 = 0;
        let n12 = 1;

        // tslint:disable-next-line:max-line-length
        let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) { d1 = 0; }

        let d2 = d1 * 2 + n12 * 3 + n11 * 4
            + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2
            + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) { d2 = 0; }
        const dots: string = formatting.withDots ? "." : "";
        const dashs: string = formatting.withDashs ? "-" : "";
        const slashs: string = formatting.withSlashs ? "/" : "";
        const fluffy = formatting.withFluffy ? "(L)(F):)(F)(L)" : "";

        // tslint:disable-next-line:max-line-length
        return "" + n1 + n2 + dots + n3 + n4 + n5 + dots + n6 + n7 + n8 + slashs + n9 + n10 + n11 + n12 + dashs + d1 + d2 + fluffy;
    }

    // tslint:disable-next-line:max-line-length
    public static generateCPF(formatting: IFormattingOptions =  {withDashs: true, withSlashs: true, withDots: true, withFluffy: false }): string {
        let n = 9;
        let n1 = this.randomNumber(n);
        let n2 = this.randomNumber(n);
        let n3 = this.randomNumber(n);
        let n4 = this.randomNumber(n);
        let n5 = this.randomNumber(n);
        let n6 = this.randomNumber(n);
        let n7 = this.randomNumber(n);
        let n8 = this.randomNumber(n);
        let n9 = this.randomNumber(n);
        let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) { d1 = 0; }
        let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) { d2 = 0; }
        const dots = formatting.withDots ? "." : "";
        const dashs = formatting.withDashs ? "-" : "";
        const fluffy = formatting.withFluffy ? " (L)(F):)(F)(L) " : "";

        return "" + fluffy + n1 + n2 + n3 + dots + n4 + n5 + n6 + dots + n7 + n8 + n9 + dashs + d1 + d2;
    }

    public static funnyResultMessage(objectName: string, result: string): string {
        return sprintf(FunnyMessages.randomKeyValueMessage(), objectName, result);
    }
}
