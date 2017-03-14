/// <reference path="typings/index.d.ts" />

import * as restify from 'restify';
import * as builder from 'botbuilder';
import {DialogBuilder} from './support/dialogs'
import { SecurityService } from './domain/services/securityService';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var dialogs = new DialogBuilder(connector);

server.post('/api/messages', connector.listen());

server.get('/api/security/allow/:temporaryToken', async function(req, res, next) {
    const temporaryToken = req.params.temporaryToken
    
    const result = await SecurityService.approveAccess(temporaryToken);
    if(!result.success)
        return res.send(`Ocorreu um erro - Tente novamente ou acione o suporte - mensagem: ${result.message}`);            

    const data = result.data;
    
    if(data.success === 0)
        return res.send(`Ocorreu um erro nos dados enviados- Tente novamente ou acione o suporte - mensagem: ${data.Message}`);            

    dialogs.bot.beginDialog(JSON.parse(JSON.parse(data.Address)), '/notifyApprovedToken', { name: data.Name, token: data.Token });

    if (next)
        next();

    return res.send(`Token liberado, nos falamos pelo chat!`);        
});
