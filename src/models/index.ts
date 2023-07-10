
import { createIndexDecorator, Sequelize, Table } from "sequelize-typescript";

import Model from "./model";
import User from "./employees/user";
import Token from "./common/token";
import Session from "./common/session";
import Address from "./common/address";
import Contact from "./employees/contact";
import Role from './employees/role';
import RoleLevel from './employees/role_level';
import Attachment from "./common/attachment";
import dotenv from "dotenv";

import Sequence from "./common/sequence";
import Document from "./document/document";
import Person from "./employees/person";
import Track from "./common/track";
import Notification from "./common/notification";
import Ticket from "./help-desk/ticket";
import TicketState from "./help-desk/ticket-state";
import TicketType from "./help-desk/ticket-type";
import Event from "./event/event";
import EventType from "./event/event-type";
import EventSchedule from "./event/event-schedule";
import LocalSetting from "./Settings/local.settings";
import SystemSetting from "./Settings/system.settings";
import DocumentSetting from "./Settings/document.settings";
import Setting from "./Settings/Settings";

import { v4 as uuid } from "uuid";
import { logger } from "../config";
import LicenseSetting from "./Settings/license.settings";
import Employee from "./employees/employee";
import Contract from './employees/contract';
import AdditionalPaymentType from "./employees/additional_payment_type";
import AdditionalPayment from "./employees/additional_payment";
import SalaryPackage from "./employees/salary_package";

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize({
  /* dialect: "sqlite",
  storage: "./database.sqlite", */
  dialect: "mysql",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000
  },
  logging: (msg: any) => logger.info(msg),
  models: [
    Contact,
    User,
    Address,
    Person,
    Document,
    Employee,
    Token,
    Session,
    Track,
    Attachment,
    Sequence,

    RoleLevel,
    Role,
    Contract,
    AdditionalPaymentType,
    AdditionalPayment,
    SalaryPackage,

    Notification,

    Ticket,
    TicketState,
    TicketType,
    Event,
    EventType,
    EventSchedule,

    LocalSetting,
    SystemSetting,
    DocumentSetting,
    LicenseSetting,
    Setting,
  ],
});

const UniqIndex = createIndexDecorator({
  name: uuid() + '-index',
  type: 'UNIQUE',
  unique: true,
});

const initialData = [{
  model: EventType, data: [
    { code: 'Matricula', name: 'Matricula' },
    { code: 'ConfirmacaoMatricula', name: 'Confirmação de Matricula' },
    { code: 'Inscricao', name: 'Inscrição' },
  ]
}, {
  model: Event, data: [
    { code: 'EVT00000013', isActive: false, name: 'Inscrição de Novos Estudantes' },
    { code: 'EVT00000012', isActive: false, name: 'Matricula de Novos Inscritos' },
    { code: 'EVT00000011', isActive: false, name: 'Inscrição de novos alunos' },
  ]
}, {
  model: TicketType, data: [
    { code: '9', descriptions: 'Cartão de Estudantes' },
    { code: '8', descriptions: 'Declaração com Notas' },
    { code: '7', descriptions: 'Declaração sem Notas' },
    { code: '6', descriptions: 'Histórico de Estudantes' },
  ]
}, {
  model: TicketState, data: [
    { code: 'Opened', descriptions: 'Aberto' },
    { code: 'Aproved', descriptions: 'Aprovado' },
    { code: 'Done', descriptions: 'Resolvido' },
    { code: 'Rejected', descriptions: 'Rejeitado' },
  ]
}, {
  model: AdditionalPaymentType, data: [
    { name: 'Bônus' },
    { name: 'Horas extras' },
    { name: 'Adiantamento salarial' },
    { name: 'Trabalho em feriados' },
    { name: 'Feriados' },
    { name: 'Horas extras' },
    { name: 'Variável' },
    { name: 'Comissões' },
    { name: 'Complemento' },
    { name: 'Disponibilidade' },
    { name: 'Acomodação' },
    { name: 'Transporte' },
    { name: 'Espaço de trabalho' },
    { name: 'Refeição' },
    { name: 'Aprendizado' },
    { name: 'Outro' }
  ]
}, {
  model: Role, data: [
    { name: 'Project manager' },
    { name: 'Software Architect' },
    { name: 'Data science' },
    { name: 'Front-end web development' },
    { name: 'Software Testing' },
    { name: 'Product Manager' },
    { name: 'System Administrator' },
    { name: 'Marketing' },
    { name: 'Data analysis' },
    { name: 'Technical Project Manager' },
    { name: 'Machine learning' },
    { name: 'Sales engineering' },
    { name: 'Developer Analyst - Trainee' },
    { name: 'Developer Analyst - Junior' },
    { name: 'Developer Analyst - Full' },
    { name: 'Developer Analyst - Senior' },
    { name: 'Assistente Comercial I' },
    { name: 'Assistente Comercial II' },
    { name: 'Assistente Comercial III' },
    { name: 'Commercial Manager' },
  ]
}, {
  model: Setting, data: [
    /*{
      code: 'NOVA',

      id: '028a5c78-710f-482c-a68d-b48cca54f35c',

      system: SystemSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),

      documents: DocumentSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),

      local: LocalSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),

      classe: ClasseSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log),

      license: LicenseSetting.create({ id: '028a5c78-710f-482c-a68d-b48cca54f35c' }).catch(console.log)
    },*/

  ]
}]
const Repo = sequelize.getRepository;
sequelize.sync({ alter: true, force: false }).then(() =>
  initialData.forEach(({ model, data }: any) => data.forEach(async (d: any) =>
    model.create(d, { include: { all: true } }).catch(console.log))
  )
).catch((x: any) => {

  const e = x;
  console.log(e)
})

enum SPs {
  GetStudentsCountOlder = 'GetStudentsCountOlder',
  GetStudentsCountAge = 'GetStudentsCountAge',
  GetStudentsCountNationality = 'GetStudentsCountNationality',
  GetStudentsCountMaritalStatus = 'GetStudentsCountMaritalStatus',
  GetStudentsCountGender = 'GetStudentsCountGender',
  GetStudentsRegistered = 'GetStudentsRegistered',
  GetStudentHonorRoll = 'GetStudentHonorRoll',
  GetStudentCount = 'GetStudentCount'
}
const Procedure = async (procedure: SPs, opts: any = {}) =>
  await sequelize
    .query('CALL ' + procedure, {})

export default sequelize;

export {
  sequelize,
  Repo,
  Model,
  Contact,
  Employee,
  Address,
  Attachment,
  Document,
  Person,
  RoleLevel,
  Role,
  Contract,
  AdditionalPaymentType,
  AdditionalPayment,
  SalaryPackage,

  User,
  Track,
  Token,
  Session,
  Sequence,
  Notification,
  Procedure,
  SPs,

  Ticket,
  TicketState,
  TicketType,
  EventSchedule,
  Event,
  EventType,

  UniqIndex,

  LocalSetting,
  SystemSetting,
  DocumentSetting,
  LicenseSetting,
  Setting,
};
