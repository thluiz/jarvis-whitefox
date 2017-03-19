import { Result } from "../../domain/result";
import { IService } from "./service";

export class EmailService implements IService {
    public static async send(email: string, subject: string, body: string): Promise<Result<string>> {
        try {
            const nodemailer = require("nodemailer");

            // create reusable transporter object using the default SMTP transport
            let transporter: any = nodemailer.createTransport({
                auth: {
                    pass: process.env.EMAIL_PASS,
                    user: process.env.EMAIL_USER,
                },
                service: "gmail",
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: "\"Jarvis\" <jarvis@whitefox.com.br>", // sender address
                html: body, // html body
                subject,
                text: body, // plain text body
                to: email, // list of receivers
            };

            // send mail with defined transport object
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return Result.Fail(error);
                }
                Result.Fail(`Message ${info.messageId} sent: %{info.response}`);
            });

            return Result.Ok<string>();
        } catch (error) {
            return Result.Fail<string>(error);
        }
    }
}
