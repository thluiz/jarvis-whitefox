"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../../support/result");
class EmailService {
    static send(email, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodemailer = require("nodemailer");
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    auth: {
                        pass: process.env.EMAIL_PASS,
                        user: process.env.EMAIL_USER,
                    },
                    service: "gmail",
                });
                // setup email data with unicode symbols
                let mailOptions = {
                    from: "\"Jarvis\" <jarvis@whitefox.com.br>",
                    html: body,
                    subject,
                    text: body,
                    to: email,
                };
                // send mail with defined transport object
                yield transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return result_1.Result.Fail(error);
                    }
                    result_1.Result.Fail(`Message ${info.messageId} sent: %{info.response}`);
                });
                return result_1.Result.Ok();
            }
            catch (error) {
                return result_1.Result.Fail(error);
            }
        });
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=emailService.js.map