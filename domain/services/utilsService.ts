/// <reference path="../../typings/index.d.ts" />

import { Service } from './Service';
import { Result } from '../../support/result';
import { sprintf } from 'sprintf-js'

export class UtilsService implements Service {
    static numeroAleatorio(n) {
        var ranNum = Math.round(Math.random() * n);
        return ranNum;
    }

    static mod(dividendo, divisor) {
        return Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
    }

    static generateCNPJ(): string {
        var n = 9;
        var n1 = this.numeroAleatorio(n);
        var n2 = this.numeroAleatorio(n);
        var n3 = this.numeroAleatorio(n);
        var n4 = this.numeroAleatorio(n);
        var n5 = this.numeroAleatorio(n);
        var n6 = this.numeroAleatorio(n);
        var n7 = this.numeroAleatorio(n);
        var n8 = this.numeroAleatorio(n);
        var n9 = 0;
        var n10 = 0;
        var n11 = 0;
        var n12 = 1;
        var d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
        d1 = 11 - (this.mod(d1, 11));
        if (d1 >= 10) d1 = 0;
        var d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
        d2 = 11 - (this.mod(d2, 11));
        if (d2 >= 10) d2 = 0;
        return '' + n1 + n2 + '.' + n3 + n4 + n5 + '.' + n6 + n7 + n8 + '/' + n9 + n10 + n11 + n12 + '-' + d1 + d2;
    }
    
    static generateCPF(): string {
        var n = 9;
        var n1 = this.numeroAleatorio(n);
        var n2 = this.numeroAleatorio(n);
        var n3 = this.numeroAleatorio(n);
        var n4 = this.numeroAleatorio(n);
        var n5 = this.numeroAleatorio(n);
        var n6 = this.numeroAleatorio(n);
        var n7 = this.numeroAleatorio(n);
        var n8 = this.numeroAleatorio(n);
        var n9 = this.numeroAleatorio(n);
        var d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
        d1 = 11 - (this.mod(d1, 11));
        if (d1 >= 10) d1 = 0;
        var d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
        d2 = 11 - (this.mod(d2, 11));
        if (d2 >= 10) d2 = 0;
        return ''+n1+n2+n3+'.'+n4+n5+n6+'.'+n7+n8+n9+'-'+d1+d2;        
    }

    static funnyResultMessage(objectName:string, result:string) {
        var messages = [];
        messages.push("Segue um %s saindo do forno: %s!");
        messages.push("Segue um %s fresquinho: %s!");
        messages.push("Hum... segura esse % aí! %s ");
        messages.push("Pensa rápido!  %s: %s ");
        messages.push("Esse %s eu vi virando a esquina: %s");
        messages.push("Arrebentei! Olha que %s lindo: %s");
        messages.push("Hum, foi mal, mas esse %s está demais: %s");
        messages.push("Não quero me gabar, mas nasci para gerar esses %s: %s");
        messages.push("Ih... agora assim, segue um %s: %s");
        messages.push("Homens trabalhando ou melhor Bots fazendo %s: %s");
        messages.push("Eu recebo para ficar o dia todo gerando %s? segue aí: %s");

        messages.push("Segue um %s aí: %s");
        messages.push("No meio do caminho tinha um %s...  e o número era: %s");
        messages.push("Batatinha quando nasce... sai um %s e o valor é: %s!");
        messages.push("Quanto eu recebo para ficar gerando %s o dia todo? segue aí: %s!");
        messages.push("Hum...! Esse %s é uma obra prima: %s!");
        messages.push("Quem diria que dava para fazer um %s assim: %s?");
        messages.push("Olha só! não vou te enganar... mas esse cálculo do %s não é fácil não - segue aí %s?");
        messages.push("supletivo, supletivo, supletivo... toma um %s aí %s?");
        messages.push("O doce perguntou pro doce: qual é o %s mas doce que batata doce... segue: %s");
        messages.push("Aaatirei o %s no gato-to-to, e ele me mandou o valor-lor-lor: %s!");
        messages.push("fala tu que to cansado! o %s é: %s!");

        return sprintf(messages[Math.floor(Math.random()*messages.length)], objectName, result);
    }
}