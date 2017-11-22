"use strict";
// tslint:disable:max-line-length
Object.defineProperty(exports, "__esModule", { value: true });
class SecurityTemplates {
    static WelcomeMessage(name, commands) {
        return `
Olá ${name},

Acabo de receber a confirmação do seu acesso.

Minha API de linguagem natural só está funcionando parcialmente, então os comandos entre [] precisam ser executados tal qual estão descritos, por exemplo: [ajuda], [help], [jogar moeda].

No momento os comandos disponíveis são:

${commands}
`;
    }
    static LoginRequestEmail(channel, temporaryToken) {
        return `
Prezado,
<br /><br />
Aqui é o Jarvis, assistente virtual da White Fox.
<br /><br />
Um usuário no [${channel}] solicitou o acesso às minhas funções, 
caso seja você basta clicar <a href='${process.env.BOT_URL}/api/security/allow/${temporaryToken}'>aqui</a>.
<br /><br />
Do contrário, basta desconsiderar que depois eu limpo.
<br /><br /><br />
Atencionsamente, 
<br />
        --
        Jarvis`;
    }
}
exports.SecurityTemplates = SecurityTemplates;
//# sourceMappingURL=securityTemplates.js.map