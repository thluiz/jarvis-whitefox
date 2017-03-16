/// <reference path="../../typings/index.d.ts" />

import { Service } from "./Service";
import { DataResult } from "../../support/result";
import { sprintf } from "sprintf-js";
import { FunnyKeyValueMessages } from "./templates/funnyKeyValueMessages";

export class UtilsService implements Service {
    static randomNumber(n: number): number {
        return Math.round(Math.random() * n);
    }

    static generateCNPJ(): string {
        let n: number = 9;
        let n1: number = this.randomNumber(n);
        let n2: number = this.randomNumber(n);
        let n3: number = this.randomNumber(n);
        let n4: number = this.randomNumber(n);
        let n5: number = this.randomNumber(n);
        let n6: number = this.randomNumber(n);
        let n7: number = this.randomNumber(n);
        let n8: number = this.randomNumber(n);
        let n9: number = 0;
        let n10: number = 0;
        let n11: number = 0;
        let n12: number = 1;

        let d1: number = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) { d1 = 0; }

        let d2: number = d1 * 2 + n12 * 3 + n11 * 4
            + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2
            + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) { d2 = 0; }
        return "" + n1 + n2 + "." + n3 + n4 + n5 + "." + n6 + n7 + n8 + "/" + n9 + n10 + n11 + n12 + "-" + d1 + d2;
    }

    static generateCPF(): string {
        let n: number = 9;
        let n1: number = this.randomNumber(n);
        let n2: number = this.randomNumber(n);
        let n3: number = this.randomNumber(n);
        let n4: number = this.randomNumber(n);
        let n5: number = this.randomNumber(n);
        let n6: number = this.randomNumber(n);
        let n7: number = this.randomNumber(n);
        let n8: number = this.randomNumber(n);
        let n9: number = this.randomNumber(n);
        let d1: number = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
        d1 = 11 - (d1 % 11);
        if (d1 >= 10) { d1 = 0; }
        let d2: number = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
        d2 = 11 - (d2 % 11);
        if (d2 >= 10) { d2 = 0; }
        return "" + n1 + n2 + n3 + "." + n4 + n5 + n6 + "." + n7 + n8 + n9 + "-" + d1 + d2;
    }

    static funnyResultMessage(objectName: string, result: string): string {
        return sprintf(FunnyKeyValueMessages.random(), objectName, result);
    }
}