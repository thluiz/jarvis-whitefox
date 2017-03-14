/// <reference path="../../typings/index.d.ts" />

import { Service } from './service'
import { Result } from '../../support/result'

export class EmailService implements Service {
    static async send(email: string, subject: string, body: string): Promise<Result> {        
        const nodemailer = require('nodemailer');

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Jarvis" <jarvis@whitefox.com.br>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
            html: body // html body
        };

        // send mail with defined transport object
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);            
        });

        return Result.Ok();
    }
}  
