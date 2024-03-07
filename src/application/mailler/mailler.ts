import { logger } from './../logger';
import nodemailer, { SendMailOptions } from "nodemailer";
import log from "../logger";
import { smtp, NODE_ENV, MAILER_USER, MY_NODE_ENV } from "../../config";
//const MAILER_USER='mailtrap@hiperbite.ao'
let transporter: any = {};

try {


  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    from: smtp.user,
    tls: {
      rejectUnauthorized: false
    }
  });
  transporter.verify(function (err: any, success: any) {
    try {
      if (err) {
        console.log(err);
        logger.info(err)
      } else {
        logger.info('Server is ready to take our messages');
      }
    } catch (err: any) {
      logger.error(err)
    }
  });

} catch (e: any) {
  let u = e;
}
/*
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "eadde1c5fd97b5",
    pass: "e97254b970141d"
  }
});*/


async function sendEmail(payload: SendMailOptions) {
  payload.bcc =
    payload.from = `Nova RH <${smtp.user}>`;

  /**
   * TODO: FIX THIS WARNING
   *  Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification
   */
  if (NODE_ENV !== 'production') {
    // payload.subject = `${MY_NODE_ENV} MODE - ${payload.subject}`
    // payload.from = MAILER_USER
  }
  try {
    transporter.sendMail(payload, (err: any, info: any) => {
      logger.error({ message: "=======================> 936927698 - success" });
      logger.error({ message: "=======================> 936927698 - success", smtp });
      if (err) {
        logger.error(err)
        log.error(err, "Error sending email");
        return;
      }

      logger.info(info);

      console.warn(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
  } catch (err: any) {
    logger.error(err)
  }
}

export default sendEmail;