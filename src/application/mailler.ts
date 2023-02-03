import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import log from "./logger";
import { smtp } from "../config";

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

//const smtp = smtp
console.log(smtp)
const transporter = nodemailer.createTransport({
  
    host: smtp.host,
    port: Number(smtp.port),
    secure: smtp.secure, // true for 465, false for other ports
    auth: {
      user: smtp.user , // generated ethereal user
      pass: smtp.pass , // generated ethereal password
    },
  
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err:any, info:any) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;