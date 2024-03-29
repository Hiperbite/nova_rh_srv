import PayrollSetting from './Settings/payroll.settings';

import { createIndexDecorator, Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Dialect } from "sequelize";

import Model from "./model";
import User from "./employees/user/user";
import Token from "./common/token";
import Session from "./common/session";
import Address from "./common/address";
import Contact from "./employees/contact";
import AccountPaymentData from "./employees/account_payment_data";
import Company from "./company/company";
import EmployeeRole from './employees/role';
import Attachment from "./common/attachment";
import dotenv from "dotenv";

import Business from "./company/business";

import Sequence from "./common/sequence";
import Document from "./document/document";
import Person from "./employees/user/person";
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
import { logger, MY_NODE_ENV, NODE_ENV } from "../config";
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
import Category from "./employees/category";
import AttendanceType from "./attendance/attendance-type";
import AttendanceJustification from "./attendance/justification";
import Attendance from "./attendance/attendance";
import Role from "./employees/user/role";
import WITaxTable from "./payroll/wi_tax_tables";

import RoleModule from "./employees/user/RoleModule";

import { tr } from "@faker-js/faker";


dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DIALECT, DB_NAME, DB_KEY } = process.env;

const dialect: Dialect | any = DB_DIALECT ?? 'mysql'
let referer = null;
const sequelizeOptions: SequelizeOptions = {
  dialect,
  storage: "./data/database.sqlite",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

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
    Attendance,
    AttendanceType,
    AttendanceJustification,
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
    Category,
    Contract,
    AdditionalPaymentType,
    AdditionalPayment,
    SalaryPackage,
    PayStub,
    Payroll,
    WITaxTable,
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
    Bank,
    EmployeeRole,
    Role,
    RoleModule,
    PayrollSetting
  ],
}
const UniqIndex = createIndexDecorator({
  name: uuid() + '-index',
  type: 'UNIQUE',
  unique: true,
});

let sequelize = new Sequelize(sequelizeOptions);
const instances: any[] = []
const switchTo = (db: any, ref: string) => {
  return;
  let instance: any;
  if (ref === '' || ref.indexOf('localhost') > -1) {
    return;
  }
  if (sequelize.options.dialect === 'sqlite')
    sequelize = new Sequelize({ ...sequelizeOptions, storage: "./data/" + db + ".database.sqlite" });
  else {
    const key = db ?? ref
      .replace('https://', '')
      .replace('http://', '')
      .replace('wwww.', '')
      .replace('.nova.ao', '')
      .replace('rh.', '')
      .replace('.', '_')
      .replace('/', '')

    logger.info({ message: 'client key : ' + key })

    instance = instances.find((x: any) => x.key === key)

    if (instance === undefined) {
      //hiperbit_hiperbite_rh
      const database = sequelize.options.database = DB_KEY + '_' + key;
      //sequelize.options.username = DB_USER + '_' + key;
      logger.info({ message: 'connecting to database with key ' + sequelize.options.database })
      instance = new Sequelize({ ...sequelizeOptions, ...{ database, username: database } });
      instances.push({ key, instance })
    } else {
      instance = instance?.instance
    }

    sequelize = instance
  }


  sequelize.options.storage = ref
}

const Repo = sequelize.getRepository;
(false &&
  sequelize
    .sync({ alter: true, force: false })
    //.then(initializer)
    .catch(console.error)
)

enum SPs {
  GetAttendaceData = "GetAttendanceData(?,?,?,?,?)",
  GetEmployeeSearch = "GetEmployeeSearch(?)",
  GetDashboardData = "GetDashboardData",
  GetRolesEmployeesCount = "GetRolesEMployeesCount",
  GetCalendarDate = "GetCalendarDate(?,?)",
  GetStudentsCountOlder = 'GetStudentsCountOlder',
  GetStudentsCountAge = 'GetStudentsCountAge',
  GetStudentsCountNationality = 'GetStudentsCountNationality',
  GetStudentsCountMaritalStatus = 'GetStudentsCountMaritalStatus',
  GetStudentsCountGender = 'GetStudentsCountGender',
  GetStudentsRegistered = 'GetStudentsRegistered',
  GetStudentHonorRoll = 'GetStudentHonorRoll',
  GetStudentCount = 'GetStudentCount',
  GetTotalWeekPresence = 'GetTotalWeekPresence(?,?)',
  GetWeekPresence = 'GetWeekPresenceFaults(?,?)',
  GetWiTAX = 'GETWITAX(?,?)',
  GetEvents = 'GetEvents'
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
  Attendance,
  AttendanceType,
  AttendanceJustification,
  AccountPaymentData,
  Employee,
  Address,
  Country,
  Company,
  Attachment,
  Document,
  Person,
  Category,
  EmployeeRole,
  Contract,
  AdditionalField,
  AdditionalPaymentType,
  AdditionalPayment,
  SalaryPackage,
  PayStub,
  Payroll,
  WITaxTable,
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
  WorkingHour,
  Role,
  RoleModule,
  PayrollSetting
};
