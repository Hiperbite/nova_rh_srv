
import { createIndexDecorator, Sequelize, Table } from "sequelize-typescript";

import Model from "./model";
import User from "./employees/user";
import Token from "./common/token";
import Session from "./common/session";
import Address from "./common/address";
import Contact from "./employees/contact";
import Company from "./company/company";
import Role from './employees/role';
import RoleLevel from './employees/role_level';
import Attachment from "./common/attachment";
import dotenv from "dotenv";

import Business from "./company/business";

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
import Payroll from "./payroll/payroll";
import PayrollLine from "./payroll/payroll_line";
import PayrollLineType from "./payroll/payroll_line_type";
import Department from "./employees/department";
import ContractAdditionalField from "./employees/additional_field";
import AdditionalField from "./employees/additional_field";
import WorkingHour from "./employees/working_hour";
import PayStub from "./payroll/pay_stub";
import PayrollStatus from "./payroll/payroll_status";

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize({
  dialect: "mysql",
  /* dialect: "sqlite",
  storage: "./database.sqlite", */
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  dialectOptions: {
    options: {
      requestTimeout: 300000
    }
  },
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
    AdditionalField,
    User,
    Address,
    Company,
    Person,
    Document,
    Employee,
    Token,
    Session,
    Track,
    Attachment,
    Sequence,

    Business,

    Contract,
    AdditionalPaymentType,
    AdditionalPayment,
    SalaryPackage,
    PayStub,
    Payroll,
    PayrollLine,
    PayrollLineType,
    PayrollStatus,

    WorkingHour,
    Notification,

    Ticket,
    TicketState,
    TicketType,
    Event,
    EventType,
    EventSchedule,

    /*LocalSetting,
    SystemSetting,
    DocumentSetting,
    LicenseSetting,
    Setting,
*/
    Department,

    RoleLevel,
    //  Role,
    Role
  ],
});

const UniqIndex = createIndexDecorator({
  name: uuid() + '-index',
  type: 'UNIQUE',
  unique: true,
});

const initialData = [
  {
    model: PayrollStatus, data: [
      { code: 0, name: 'Aberto' },
      { code: 1, name: 'Analise  ' },
      { code: 2, name: 'Confirmação' },
      { code: 3, name: 'Aprovação' },
      { code: 4, name: 'Execução' },
    ]
  },
  {
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

      { code: '1000', name: 'Vencimento Base', level: 1 },
      { code: '1401', level: 0, name: 'Almoço' },
      { code: '1406', level: 0, name: 'Competitividade' },
      { code: 'BN', level: 0, name: 'Bônus' },
      { code: 'HE', level: 0, name: 'Horas extras' },
      { code: 'AS', level: 0, name: 'Adiantamento salarial' },
      { code: 'TF', level: 0, name: 'Trabalho em feriados' },
      { code: 'VC', level: 0, name: 'Feriados' },
      { code: 'HE', level: 0, name: 'Horas extras' },
      { code: 'VA', level: 0, name: 'Variável' },
      { code: 'CM', level: 0, name: 'Comissões' },
      { code: 'CP', level: 0, name: 'Complemento' },
      { code: 'DS', level: 0, name: 'Disponibilidade' },
      { code: 'AC', level: 0, name: 'Acomodação' },
      { code: 'TR', level: 0, name: 'Transporte' },
      { code: 'ET', level: 0, name: 'Espaço de trabalho' },
      { code: 'RF', level: 0, name: 'Refeição' },
      { code: 'AP', level: 0, name: 'Aprendizado' },
      { code: 'OU', level: 0, name: 'Outro' }
    ]
  },
  {
    model: Role, data: [
      { code: '1', name: 'Project manager' },
      { code: '2', name: 'Software Architect' },
      { code: '3', name: 'Data science' },
      { code: '4', name: 'Front-end web development' },
      { code: '5', name: 'Software Testing' },
      { code: '6', name: 'Product Manager' },
      { code: '7', name: 'System Administrator' },
      { code: '8', name: 'Marketing' },
      { code: '9', name: 'Data analysis' },
      { code: '10', name: 'Technical Project Manager' },
      { code: '11', name: 'Machine learning' },
      { code: '12', name: 'Sales engineering' },
      { code: '13', name: 'Developer Analyst - Trainee' },
      { code: '14', name: 'Developer Analyst - Junior' },
      { code: '15', name: 'Developer Analyst - Full' },
      { code: '16', name: 'Developer Analyst - Senior' },
      { code: '17', name: 'Assistente Comercial I' },
      { code: '18', name: 'Assistente Comercial II' },
      { code: '19', name: 'Assistente Comercial III' },
      { code: '20', name: 'Commercial Manager' },
    ]
  },
  {
    model: Department, data: [
      {
        name: 'Executive Council', code: 'CEX',
        childs: [
          { name: 'Direcção de Recursos Humanos', code: 'DRH' },
          { name: 'Direcção Comercial', code: 'DCO' },
          { name: 'Direcção Financeira e de Contabilidades', code: 'DFC' },
          { name: 'Direcção de Tecnologia', code: 'DTI' }]
      }]
  },
  {
    model: Company, data: [
      {
        code: 'A',
        name: '',
        description: '',
        business: '',
        nif: '',
        socialCapital: 0,
        integrationToken: '',
        slogan: '',
        logos: ''
      }]
  },
  {
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
if (true) {
  sequelize.sync({ alter: true, force: false}).then(() =>
    initialData.forEach(({ model, data }: any) => data.forEach(async (d: any) => {
      try {

        model.find({ where: { code: d.code } }).then((f: any) => {
          if (f) { } else {
            model.create(d, { include: { all: true } }).catch(console.log)
          }
        }).catch(console.log)

      } catch (e: any) {
        let u = e;
      }
    }))


  ).catch((x: any) => {
    const e = x;
    console.log(e)
  })
}

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
  Company,
  Attachment,
  Document,
  Person,
  RoleLevel,
  Role,
  Contract,
  AdditionalField,
  AdditionalPaymentType,
  AdditionalPayment,
  SalaryPackage,
  PayStub,
  Payroll,
  PayrollLine,
  PayrollLineType,
  PayrollStatus,

  Business,

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
  Department,
  WorkingHour
};
