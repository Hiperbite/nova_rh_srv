import { logger } from './../logger';
import send from "./mailler";
import ejs from "ejs";
import path from "path";
import { WEB_CLIENT_URL } from "../../config";

const mailServices = {
  createUser: {
    template: "user/createUser",
    subject: /* "Be welcome", */ "Bem-vindo ao Nova RH!"
  },
  forgotPassword: {
    template: "user/forgotPassword",
    subject: "Redefinir palavra-passe",
  },
  beWelcome: {
    template: "student/beWelcome",
    subject: "Be welcome",
  },
  createStudent: {
    template: "student/createStudent",
    subject: "Seja bem vindo ao Nova academico",
  },
  createEnrollment: {
    template: "student/createEnrollment",
    subject: "Matricula feita com sucesso",
  },
};

const sendEmail = async ({ service, data }: { service: any; data: any }) => {
  logger.error({ service, data })
  const clientUrl = WEB_CLIENT_URL ?? "http://localhost:3000/"//data?.sequelize?.options?.storage;
  ejs.renderFile(layout, { data, app: { WEB_CLIENT_URL: clientUrl }, ...service }, (err: any, html: any) => {
    const payload = {
      to: data?.email,
      ...service,
      html,
    };
    if (html) {
      send(payload);
    } else {
      logger.info(err)
    }
  });
};
const layout = path.resolve(
  __dirname + "/../../helpers/mailer/templates/layout.html.ejs_"
);
const render = () => { };
export { mailServices };
export default sendEmail;
