
import { createIndexDecorator, Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";

import Model from "./model";
import User from "./employees/user";
import Token from "./common/token";
import Session from "./common/session";
import Address from "./common/address";
import Contact from "./employees/contact";
import AccountPaymentData from "./employees/account_payment_data";
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
import AdditionalField from "./employees/additional_field";
import WorkingHour from "./employees/working_hour";
import PayStub from "./payroll/pay_stub";
import PayrollStatus from "./payroll/payroll_status";
import Country from "./common/country";
import { initializer } from "./initializer";
import Bank from "./company/bank";
import ContactType from "./employees/contact-type";

dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DIALECT, DB_NAME } = process.env;

const dialect: Dialect | any = DB_DIALECT ?? 'mysql'

const sequelizeOptions = {
  dialect,
  storage: "./data/ccc.database.sqlite",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  dialectOptions: {
    options: {
      requestTimeout: 300000,
      transactionType: 'IMMEDIATE'
    }
  },
  retry: {
    match: [
      /SQLITE_BUSY/,
    ],
    name: 'query',
    max: 5
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
    Country,
    Business,
    Contact,
    AdditionalField,
    User,
    Address,
    Company,
    Person,
    Document,
    AccountPaymentData,
    Employee,
    Token,
    Session,
    Track,
    Attachment,
    Sequence,

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

    Department,
    ContactType,
    RoleLevel,
    Bank,
    Role,
  ],
}
let sequelize = new Sequelize(sequelizeOptions);
const UniqIndex = createIndexDecorator({
  name: uuid() + '-index',
  type: 'UNIQUE',
  unique: true,
});

const switchTo = (db: string) => {
  if (sequelize.options.dialect === 'sqlite')
    sequelize = new Sequelize({ ...sequelizeOptions, storage: "./data/" + db + ".database.sqlite" });
  else
    sequelize.options.database = "n_" + db + "_nova_rh";
}
const Repo = sequelize.getRepository;
(false &&
  sequelize
    .sync({ alter: true, force: true })
    .then(initializer)
    .catch(console.error)
)

enum SPs {
  GetDashboardData = "GetDashboardData",
  GetRolesEmployeesCount = "GetRolesEMployeesCount",
  GetCallendarDate = "GetCallendarDate(?,?)",
  GetStudentsCountOlder = 'GetStudentsCountOlder',
  GetStudentsCountAge = 'GetStudentsCountAge',
  GetStudentsCountNationality = 'GetStudentsCountNationality',
  GetStudentsCountMaritalStatus = 'GetStudentsCountMaritalStatus',
  GetStudentsCountGender = 'GetStudentsCountGender',
  GetStudentsRegistered = 'GetStudentsRegistered',
  GetStudentHonorRoll = 'GetStudentHonorRoll',
  GetStudentCount = 'GetStudentCount'
}
const Procedure = async (procedure: SPs, opts: any = []) =>
  await sequelize
    .query('CALL ' + procedure, {
      replacements: opts
    })

export default sequelize;

export {
  switchTo,
  sequelize,
  Repo,
  Model,
  ContactType,
  Contact,
  AccountPaymentData,
  Employee,
  Address,
  Country,
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
  Bank,

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
