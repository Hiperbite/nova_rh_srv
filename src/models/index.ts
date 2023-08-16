
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
import Country from "./common/country";

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
    Country,
    Business,
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
    model: Country, data: [{
      nationality: "afegãne",
      name: "Afeganistão",
      originalName: "Afghanistan",
      code: "AF"
    },
    {
      nationality: "sul-africana",
      name: "África do Sul",
      originalName: "South Africa",
      code: "ZA"
    },
    {
      nationality: "albanesa",
      name: "Albânia",
      originalName: "Albania",
      code: "AL"
    },
    {
      nationality: "alemã",
      name: "Alemanha",
      originalName: "Germany",
      code: "DE"
    },
    {
      nationality: "andorrana",
      name: "Andorra",
      originalName: "Andorra",
      code: "AD"
    },
    {
      nationality: "angolana",
      name: "Angola",
      originalName: "Angola",
      code: "AO"
    },
    {
      nationality: "anguillana",
      name: "Anguilla",
      originalName: "Anguilla",
      code: "AI"
    },
    {
      nationality: "de antártida",
      name: "Antártida",
      originalName: "Antarctica",
      code: "AQ"
    },
    {
      nationality: "antiguana",
      name: "Antígua e Barbuda",
      originalName: "Antigua & Barbuda",
      code: "AG"
    },
    {
      nationality: "saudita",
      name: "Arábia Saudita",
      originalName: "Saudi Arabia",
      code: "SA"
    },
    {
      nationality: "argelina",
      name: "Argélia",
      originalName: "Algeria",
      code: "DZ"
    },
    {
      nationality: "argentina",
      name: "Argentina",
      originalName: "Argentina",
      code: "AR"
    },
    {
      nationality: "armênia",
      name: "Armênia",
      originalName: "Armenia",
      code: "AM"
    },
    {
      nationality: "arubana",
      name: "Aruba",
      originalName: "Aruba",
      code: "AW"
    },
    {
      nationality: "australiana",
      name: "Austrália",
      originalName: "Australia",
      code: "AU"
    },
    {
      nationality: "austríaca",
      name: "Áustria",
      originalName: "Austria",
      code: "AT"
    },
    {
      nationality: "azerbaijano",
      name: "Azerbaijão",
      originalName: "Azerbaijan",
      code: "AZ"
    },
    {
      nationality: "bahamense",
      name: "Bahamas",
      originalName: "Bahamas",
      code: "BS"
    },
    {
      nationality: "barenita",
      name: "Bahrein",
      originalName: "Bahrain",
      code: "BH"
    },
    {
      nationality: "bengali",
      name: "Bangladesh",
      originalName: "Bangladesh",
      code: "BD"
    },
    {
      nationality: "barbadiana",
      name: "Barbados",
      originalName: "Barbados",
      code: "BB"
    },
    {
      nationality: "bielo-russa",
      name: "Belarus",
      originalName: "Belarus",
      code: "BY"
    },
    {
      nationality: "belga",
      name: "Bélgica",
      originalName: "Belgium",
      code: "BE"
    },
    {
      nationality: "belizenha",
      name: "Belize",
      originalName: "Belize",
      code: "BZ"
    },
    {
      nationality: "beninense",
      name: "Benin",
      originalName: "Benin",
      code: "BJ"
    },
    {
      nationality: "bermudiana",
      name: "Bermudas",
      originalName: "Bermuda",
      code: "BM"
    },
    {
      nationality: "boliviana",
      name: "Bolívia",
      originalName: "Bolivia",
      code: "BO"
    },
    {
      nationality: "bósnia",
      name: "Bósnia-Herzegóvina",
      originalName: "Bosnia & Herzegovina",
      code: "BA"
    },
    {
      nationality: "betchuana",
      name: "Botsuana",
      originalName: "Botswana",
      code: "BW"
    },
    {
      nationality: "brasileira",
      name: "Brasil",
      originalName: "Brazil",
      code: "BR"
    },
    {
      nationality: "bruneiana",
      name: "Brunei",
      originalName: "Brunei",
      code: "BN"
    },
    {
      nationality: "búlgara",
      name: "Bulgária",
      originalName: "Bulgaria",
      code: "BG"
    },
    {
      nationality: "burquinês",
      name: "Burkina Fasso",
      originalName: "Burkina Faso",
      code: "BF"
    },
    {
      nationality: "burundinesa",
      name: "Burundi",
      originalName: "Burundi",
      code: "BI"
    },
    {
      nationality: "butanesa",
      name: "Butão",
      originalName: "Bhutan",
      code: "BT"
    },
    {
      nationality: "cabo-verdiana",
      name: "Cabo Verde",
      originalName: "Cape Verde",
      code: "CV"
    },
    {
      nationality: "camaronesa",
      name: "Camarões",
      originalName: "Cameroon",
      code: "CM"
    },
    {
      nationality: "cambojana",
      name: "Camboja",
      originalName: "Cambodia",
      code: "KH"
    },
    {
      nationality: "canadense",
      name: "Canadá",
      originalName: "Canada",
      code: "CA"
    },
    {
      nationality: "canário",
      name: "Canárias",
      originalName: "Canary Islands",
      code: "IC"
    },
    {
      nationality: "cazaque",
      name: "Cazaquistão",
      originalName: "Kazakhstan",
      code: "KZ"
    },
    {
      nationality: "de ceuta e melilla",
      name: "Ceuta e Melilla",
      originalName: "Ceuta & Melilla",
      code: "EA"
    },
    {
      nationality: "chadiana",
      name: "Chade",
      originalName: "Chad",
      code: "TD"
    },
    {
      nationality: "chilena",
      name: "Chile",
      originalName: "Chile",
      code: "CL"
    },
    {
      nationality: "chinesa",
      name: "China",
      originalName: "China",
      code: "CN"
    },
    {
      nationality: "cipriota",
      name: "Chipre",
      originalName: "Cyprus",
      code: "CY"
    },
    {
      nationality: "cingapuriana",
      name: "Cingapura",
      originalName: "Singapore",
      code: "SG"
    },
    {
      nationality: "colombiana",
      name: "Colômbia",
      originalName: "Colombia",
      code: "CO"
    },
    {
      nationality: "comorense",
      name: "Comores",
      originalName: "Comoros",
      code: "KM"
    },
    {
      nationality: "congolesa",
      name: "Congo",
      originalName: "Congo (Republic)",
      code: "CG"
    },
    {
      nationality: "norte-coreano",
      name: "Coréia do Norte",
      originalName: "North Korea",
      code: "KP"
    },
    {
      nationality: "norte-coreana",
      name: "Coréia do Sul",
      originalName: "South Korea",
      code: "KR"
    },
    {
      nationality: "marfinense",
      name: "Costa do Marfim",
      originalName: "Côte d¿Ivoire",
      code: "CI"
    },
    {
      nationality: "costarriquenha",
      name: "Costa Rica",
      originalName: "Costa Rica",
      code: "CR"
    },
    {
      nationality: "croata",
      name: "Croácia",
      originalName: "Croatia",
      code: "HR"
    },
    {
      nationality: "cubana",
      name: "Cuba",
      originalName: "Cuba",
      code: "CU"
    },
    {
      nationality: "curaçauense",
      name: "Curaçao",
      originalName: "Curaçao",
      code: "CW"
    },
    {
      nationality: "chagositano",
      name: "Diego Garcia",
      originalName: "Diego Garcia",
      code: "DG"
    },
    {
      nationality: "dinamarquesa",
      name: "Dinamarca",
      originalName: "Denmark",
      code: "DK"
    },
    {
      nationality: "djibutiana",
      name: "Djibuti",
      originalName: "Djibouti",
      code: "DJ"
    },
    {
      nationality: "dominiquense",
      name: "Dominica",
      originalName: "Dominica",
      code: "DM"
    },
    {
      nationality: "egípcia",
      name: "Egito",
      originalName: "Egypt",
      code: "EG"
    },
    {
      nationality: "salvadorenha",
      name: "El Salvador",
      originalName: "El Salvador",
      code: "SV"
    },
    {
      nationality: "árabe",
      name: "Emirados Árabes Unidos",
      originalName: "United Arab Emirates",
      code: "AE"
    },
    {
      nationality: "equatoriana",
      name: "Equador",
      originalName: "Ecuador",
      code: "EC"
    },
    {
      nationality: "eritreia",
      name: "Eritréia",
      originalName: "Eritrea",
      code: "ER"
    },
    {
      nationality: "eslovaco",
      name: "Eslováquia",
      originalName: "Slovakia",
      code: "SK"
    },
    {
      nationality: "esloveno",
      name: "Eslovênia",
      originalName: "Slovenia",
      code: "SI"
    },
    {
      nationality: "espanhola",
      name: "Espanha",
      originalName: "Spain",
      code: "ES"
    },
    {
      nationality: "norte-americana",
      name: "Estados Unidos",
      originalName: "United States",
      code: "US"
    },
    {
      nationality: "estoniana",
      name: "Estônia",
      originalName: "Estonia",
      code: "EE"
    },
    {
      nationality: "etíope",
      name: "Etiópia",
      originalName: "Ethiopia",
      code: "ET"
    },
    {
      nationality: "fijiana",
      name: "Fiji",
      originalName: "Fiji",
      code: "FJ"
    },
    {
      nationality: "filipina",
      name: "Filipinas",
      originalName: "Philippines",
      code: "PH"
    },
    {
      nationality: "finlandesa",
      name: "Finlândia",
      originalName: "Finland",
      code: "FI"
    },
    {
      nationality: "francesa",
      name: "França",
      originalName: "France",
      code: "FR"
    },
    {
      nationality: "gabonesa",
      name: "Gabão",
      originalName: "Gabon",
      code: "GA"
    },
    {
      nationality: "gambiana",
      name: "Gâmbia",
      originalName: "Gambia",
      code: "GM"
    },
    {
      nationality: "ganense",
      name: "Gana",
      originalName: "Ghana",
      code: "GH"
    },
    {
      nationality: "georgiana",
      name: "Geórgia",
      originalName: "Georgia",
      code: "GE"
    },
    {
      nationality: "gibraltariana",
      name: "Gibraltar",
      originalName: "Gibraltar",
      code: "GI"
    },
    {
      nationality: "inglesa",
      name: "Grã-Bretanha (Reino Unido, UK)",
      originalName: "United Kingdom",
      code: "GB"
    },
    {
      nationality: "granadina",
      name: "Granada",
      originalName: "Grenada",
      code: "GD"
    },
    {
      nationality: "grega",
      name: "Grécia",
      originalName: "Greece",
      code: "GR"
    },
    {
      nationality: "groenlandesa",
      name: "Groelândia",
      originalName: "Greenland",
      code: "GL"
    },
    {
      nationality: "guadalupense",
      name: "Guadalupe",
      originalName: "Guadeloupe",
      code: "GP"
    },
    {
      nationality: "guamês",
      name: "Guam (Território dos Estados Unidos)",
      originalName: "Guam",
      code: "GU"
    },
    {
      nationality: "guatemalteca",
      name: "Guatemala",
      originalName: "Guatemala",
      code: "GT"
    },
    {
      nationality: "guernesiano",
      name: "Guernsey",
      originalName: "Guernsey",
      code: "GG"
    },
    {
      nationality: "guianense",
      name: "Guiana",
      originalName: "Guyana",
      code: "GY"
    },
    {
      nationality: "franco-guianense",
      name: "Guiana Francesa",
      originalName: "French Guiana",
      code: "GF"
    },
    {
      nationality: "guinéu-equatoriano ou equatoguineana",
      name: "Guiné",
      originalName: "Guinea",
      code: "GN"
    },
    {
      nationality: "guinéu-equatoriano",
      name: "Guiné Equatorial",
      originalName: "Equatorial Guinea",
      code: "GQ"
    },
    {
      nationality: "guineense",
      name: "Guiné-Bissau",
      originalName: "Guinea-Bissau",
      code: "GW"
    },
    {
      nationality: "haitiana",
      name: "Haiti",
      originalName: "Haiti",
      code: "HT"
    },
    {
      nationality: "holandês",
      name: "Holanda",
      originalName: "Netherlands",
      code: "NL"
    },
    {
      nationality: "hondurenha",
      name: "Honduras",
      originalName: "Honduras",
      code: "HN"
    },
    {
      nationality: "hong-konguiana ou chinesa",
      name: "Hong Kong",
      originalName: "Hong Kong",
      code: "HK"
    },
    {
      nationality: "húngara",
      name: "Hungria",
      originalName: "Hungary",
      code: "HU"
    },
    {
      nationality: "iemenita",
      name: "Iêmen",
      originalName: "Yemen",
      code: "YE"
    },
    {
      nationality: "da ilha bouvet",
      name: "Ilha Bouvet",
      originalName: "Bouvet Island",
      code: "BV"
    },
    {
      nationality: "da ilha de ascensão",
      name: "Ilha de Ascensão",
      originalName: "Ascension Island",
      code: "AC"
    },
    {
      nationality: "da ilha de clipperton",
      name: "Ilha de Clipperton",
      originalName: "Clipperton Island",
      code: "CP"
    },
    {
      nationality: "manês",
      name: "Ilha de Man",
      originalName: "Isle of Man",
      code: "IM"
    },
    {
      nationality: "natalense",
      name: "Ilha Natal",
      originalName: "Christmas Island",
      code: "CX"
    },
    {
      nationality: "pitcairnense",
      name: "Ilha Pitcairn",
      originalName: "Pitcairn Islands",
      code: "PN"
    },
    {
      nationality: "reunionense",
      name: "Ilha Reunião",
      originalName: "Réunion",
      code: "RE"
    },
    {
      nationality: "alandês",
      name: "Ilhas Aland",
      originalName: "Åland Islands",
      code: "AX"
    },
    {
      nationality: "caimanês",
      name: "Ilhas Cayman",
      originalName: "Cayman Islands",
      code: "KY"
    },
    {
      nationality: "coquense",
      name: "Ilhas Cocos",
      originalName: "Cocos (Keeling) Islands",
      code: "CC"
    },
    {
      nationality: "cookense",
      name: "Ilhas Cook",
      originalName: "Cook Islands",
      code: "CK"
    },
    {
      nationality: "faroense",
      name: "Ilhas Faroes",
      originalName: "Faroe Islands",
      code: "FO"
    },
    {
      nationality: "das ilhas geórgia do sul e sandwich do sul",
      name: "Ilhas Geórgia do Sul e Sandwich do Sul",
      originalName: "South Georgia & South Sandwich Islands",
      code: "GS"
    },
    {
      nationality: "das ilhas heard e mcdonald",
      name: "Ilhas Heard e McDonald (Território da Austrália)",
      originalName: "Heard & McDonald Islands",
      code: "HM"
    },
    {
      nationality: "malvinense",
      name: "Ilhas Malvinas",
      originalName: "Falkland Islands (Islas Malvinas)",
      code: "FK"
    },
    {
      nationality: "norte-marianense",
      name: "Ilhas Marianas do Norte",
      originalName: "Northern Mariana Islands",
      code: "MP"
    },
    {
      nationality: "marshallino",
      name: "Ilhas Marshall",
      originalName: "Marshall Islands",
      code: "MH"
    },
    {
      nationality: "das ilhas menores afastadas",
      name: "Ilhas Menores dos Estados Unidos",
      originalName: "U.S. Outlying Islands",
      code: "UM"
    },
    {
      nationality: "norfolquino",
      name: "Ilhas Norfolk",
      originalName: "Norfolk Island",
      code: "NF"
    },
    {
      nationality: "salomônico",
      name: "Ilhas Salomão",
      originalName: "Solomon Islands",
      code: "SB"
    },
    {
      nationality: "seichelense",
      name: "Ilhas Seychelles",
      originalName: "Seychelles",
      code: "SC"
    },
    {
      nationality: "toquelauano",
      name: "Ilhas Tokelau",
      originalName: "Tokelau",
      code: "TK"
    },
    {
      nationality: "turquês",
      name: "Ilhas Turks e Caicos",
      originalName: "Turks & Caicos Islands",
      code: "TC"
    },
    {
      nationality: "virginense",
      name: "Ilhas Virgens (Estados Unidos)",
      originalName: "U.S. Virgin Islands",
      code: "VI"
    },
    {
      nationality: "virginense",
      name: "Ilhas Virgens (Inglaterra)",
      originalName: "British Virgin Islands",
      code: "VG"
    },
    {
      nationality: "indiano",
      name: "Índia",
      originalName: "India",
      code: "IN"
    },
    {
      nationality: "indonésia",
      name: "Indonésia",
      originalName: "Indonesia",
      code: "ID"
    },
    {
      nationality: "iraniano",
      name: "Irã",
      originalName: "Iran",
      code: "IR"
    },
    {
      nationality: "iraquiana",
      name: "Iraque",
      originalName: "Iraq",
      code: "IQ"
    },
    {
      nationality: "irlandesa",
      name: "Irlanda",
      originalName: "Ireland",
      code: "IE"
    },
    {
      nationality: "islandesa",
      name: "Islândia",
      originalName: "Iceland",
      code: "IS"
    },
    {
      nationality: "israelense",
      name: "Israel",
      originalName: "Israel",
      code: "IL"
    },
    {
      nationality: "italiana",
      name: "Itália",
      originalName: "Italy",
      code: "IT"
    },
    {
      nationality: "jamaicana",
      name: "Jamaica",
      originalName: "Jamaica",
      code: "JM"
    },
    {
      nationality: "japonesa",
      name: "Japão",
      originalName: "Japan",
      code: "JP"
    },
    {
      nationality: "canalina",
      name: "Jersey",
      originalName: "Jersey",
      code: "JE"
    },
    {
      nationality: "jordaniana",
      name: "Jordânia",
      originalName: "Jordan",
      code: "JO"
    },
    {
      nationality: "kiribatiana",
      name: "Kiribati",
      originalName: "Kiribati",
      code: "KI"
    },
    {
      nationality: "kosovar",
      name: "Kosovo",
      originalName: "Kosovo",
      code: "XK"
    },
    {
      nationality: "kuwaitiano",
      name: "Kuait",
      originalName: "Kuwait",
      code: "KW"
    },
    {
      nationality: "laosiana",
      name: "Laos",
      originalName: "Laos",
      code: "LA"
    },
    {
      nationality: "lesota",
      name: "Lesoto",
      originalName: "Lesotho",
      code: "LS"
    },
    {
      nationality: "letão",
      name: "Letônia",
      originalName: "Latvia",
      code: "LV"
    },
    {
      nationality: "libanesa",
      name: "Líbano",
      originalName: "Lebanon",
      code: "LB"
    },
    {
      nationality: "liberiana",
      name: "Libéria",
      originalName: "Liberia",
      code: "LR"
    },
    {
      nationality: "líbia",
      name: "Líbia",
      originalName: "Libya",
      code: "LY"
    },
    {
      nationality: "liechtensteiniense",
      name: "Liechtenstein",
      originalName: "Liechtenstein",
      code: "LI"
    },
    {
      nationality: "lituana",
      name: "Lituânia",
      originalName: "Lithuania",
      code: "LT"
    },
    {
      nationality: "luxemburguesa",
      name: "Luxemburgo",
      originalName: "Luxembourg",
      code: "LU"
    },
    {
      nationality: "macauense",
      name: "Macau",
      originalName: "Macau",
      code: "MO"
    },
    {
      nationality: "macedônio",
      name: "Macedônia (República Yugoslava)",
      originalName: "Macedonia (FYROM)",
      code: "MK"
    },
    {
      nationality: "malgaxe",
      name: "Madagascar",
      originalName: "Madagascar",
      code: "MG"
    },
    {
      nationality: "malaia",
      name: "Malásia",
      originalName: "Malaysia",
      code: "MY"
    },
    {
      nationality: "malauiano",
      name: "Malaui",
      originalName: "Malawi",
      code: "MW"
    },
    {
      nationality: "maldívia",
      name: "Maldivas",
      originalName: "Maldives",
      code: "MV"
    },
    {
      nationality: "malinesa",
      name: "Mali",
      originalName: "Mali",
      code: "ML"
    },
    {
      nationality: "maltesa",
      name: "Malta",
      originalName: "Malta",
      code: "MT"
    },
    {
      nationality: "marroquina",
      name: "Marrocos",
      originalName: "Morocco",
      code: "MA"
    },
    {
      nationality: "martiniquense",
      name: "Martinica",
      originalName: "Martinique",
      code: "MQ"
    },
    {
      nationality: "mauriciana",
      name: "Maurício",
      originalName: "Mauritius",
      code: "MU"
    },
    {
      nationality: "mauritana",
      name: "Mauritânia",
      originalName: "Mauritania",
      code: "MR"
    },
    {
      nationality: "maiotense",
      name: "Mayotte",
      originalName: "Mayotte",
      code: "YT"
    },
    {
      nationality: "mexicana",
      name: "México",
      originalName: "Mexico",
      code: "MX"
    },
    {
      nationality: "micronésia",
      name: "Micronésia",
      originalName: "Micronesia",
      code: "FM"
    },
    {
      nationality: "moçambicana",
      name: "Moçambique",
      originalName: "Mozambique",
      code: "MZ"
    },
    {
      nationality: "moldavo",
      name: "Moldova",
      originalName: "Moldova",
      code: "MD"
    },
    {
      nationality: "monegasca",
      name: "Mônaco",
      originalName: "Monaco",
      code: "MC"
    },
    {
      nationality: "mongol",
      name: "Mongólia",
      originalName: "Mongolia",
      code: "MN"
    },
    {
      nationality: "montenegra",
      name: "Montenegro",
      originalName: "Montenegro",
      code: "ME"
    },
    {
      nationality: "montserratiano",
      name: "Montserrat",
      originalName: "Montserrat",
      code: "MS"
    },
    {
      nationality: "birmanês",
      name: "Myanma",
      originalName: "Myanmar (Burma)",
      code: "MM"
    },
    {
      nationality: "namíbia",
      name: "Namíbia",
      originalName: "Namibia",
      code: "NA"
    },
    {
      nationality: "nauruana",
      name: "Nauru",
      originalName: "Nauru",
      code: "NR"
    },
    {
      nationality: "nepalesa",
      name: "Nepal",
      originalName: "Nepal",
      code: "NP"
    },
    {
      nationality: "nicaraguense",
      name: "Nicarágua",
      originalName: "Nicaragua",
      code: "NI"
    },
    {
      nationality: "nigerina",
      name: "Níger",
      originalName: "Niger",
      code: "NE"
    },
    {
      nationality: "nigeriana",
      name: "Nigéria",
      originalName: "Nigeria",
      code: "NG"
    },
    {
      nationality: "niueana",
      name: "Niue",
      originalName: "Niue",
      code: "NU"
    },
    {
      nationality: "norueguesa",
      name: "Noruega",
      originalName: "Norway",
      code: "NO"
    },
    {
      nationality: "caledônia",
      name: "Nova Caledônia",
      originalName: "New Caledonia",
      code: "NC"
    },
    {
      nationality: "neozelandesa",
      name: "Nova Zelândia",
      originalName: "New Zealand",
      code: "NZ"
    },
    {
      nationality: "omani",
      name: "Omã",
      originalName: "Oman",
      code: "OM"
    },
    {
      nationality: "dos países baixos caribenhos",
      name: "Países Baixos Caribenhos",
      originalName: "Caribbean Netherlands",
      code: "BQ"
    },
    {
      nationality: "palauense",
      name: "Palau",
      originalName: "Palau",
      code: "PW"
    },
    {
      nationality: "palestino",
      name: "Palestina",
      originalName: "Palestine",
      code: "PS"
    },
    {
      nationality: "zona do canal do panamá",
      name: "Panamá",
      originalName: "Panama",
      code: "PA"
    },
    {
      nationality: "pauásia",
      name: "Papua-Nova Guiné",
      originalName: "Papua New Guinea",
      code: "PG"
    },
    {
      nationality: "paquistanesa",
      name: "Paquistão",
      originalName: "Pakistan",
      code: "PK"
    },
    {
      nationality: "paraguaia",
      name: "Paraguai",
      originalName: "Paraguay",
      code: "PY"
    },
    {
      nationality: "peruana",
      name: "Peru",
      originalName: "Peru",
      code: "PE"
    },
    {
      nationality: "franco-polinésia",
      name: "Polinésia Francesa",
      originalName: "French Polynesia",
      code: "PF"
    },
    {
      nationality: "polonesa",
      name: "Polônia",
      originalName: "Poland",
      code: "PL"
    },
    {
      nationality: "portorriquenha",
      name: "Porto Rico",
      originalName: "Puerto Rico",
      code: "PR"
    },
    {
      nationality: "portuguesa",
      name: "Portugal",
      originalName: "Portugal",
      code: "PT"
    },
    {
      nationality: "catarense",
      name: "Qatar",
      originalName: "Qatar",
      code: "QA"
    },
    {
      nationality: "queniano",
      name: "Quênia",
      originalName: "Kenya",
      code: "KE"
    },
    {
      nationality: "quirguiz",
      name: "Quirguistão",
      originalName: "Kyrgyzstan",
      code: "KG"
    },
    {
      nationality: "centro-africana",
      name: "República Centro-Africana",
      originalName: "Central African Republic",
      code: "CF"
    },
    {
      nationality: "congolesa",
      name: "República Democrática do Congo",
      originalName: "Congo (DRC)",
      code: "CD"
    },
    {
      nationality: "dominicana",
      name: "República Dominicana",
      originalName: "Dominican Republic",
      code: "DO"
    },
    {
      nationality: "tcheco",
      name: "República Tcheca",
      originalName: "Czech Republic",
      code: "CZ"
    },
    {
      nationality: "romena",
      name: "Romênia",
      originalName: "Romania",
      code: "RO"
    },
    {
      nationality: "ruandesa",
      name: "Ruanda",
      originalName: "Rwanda",
      code: "RW"
    },
    {
      nationality: "russa",
      name: "Rússia (antiga URSS) - Federação Russa",
      originalName: "Russia",
      code: "RU"
    },
    {
      nationality: "saariano",
      name: "Saara Ocidental",
      originalName: "Western Sahara",
      code: "EH"
    },
    {
      nationality: "pedro-miquelonense",
      name: "Saint-Pierre e Miquelon",
      originalName: "St. Pierre & Miquelon",
      code: "PM"
    },
    {
      nationality: "samoana",
      name: "Samoa Americana",
      originalName: "American Samoa",
      code: "AS"
    },
    {
      nationality: "samoano",
      name: "Samoa Ocidental",
      originalName: "Samoa",
      code: "WS"
    },
    {
      nationality: "samarinês",
      name: "San Marino",
      originalName: "San Marino",
      code: "SM"
    },
    {
      nationality: "helenense",
      name: "Santa Helena",
      originalName: "St. Helena",
      code: "SH"
    },
    {
      nationality: "santa-lucense",
      name: "Santa Lúcia",
      originalName: "St. Lucia",
      code: "LC"
    },
    {
      nationality: "são-bartolomeense",
      name: "São Bartolomeu",
      originalName: "St. Barthélemy",
      code: "BL"
    },
    {
      nationality: "são-cristovense",
      name: "São Cristóvão e Névis",
      originalName: "St. Kitts & Nevis",
      code: "KN"
    },
    {
      nationality: "são-martinhense",
      name: "São Martim",
      originalName: "St. Martin",
      code: "MF"
    },
    {
      nationality: "são-martinhense",
      name: "São Martinho",
      originalName: "Sint Maarten",
      code: "SX"
    },
    {
      nationality: "são-tomense",
      name: "São Tomé e Príncipe",
      originalName: "São Tomé & Príncipe",
      code: "ST"
    },
    {
      nationality: "sao-vicentino",
      name: "São Vicente e Granadinas",
      originalName: "St. Vincent & Grenadines",
      code: "VC"
    },
    {
      nationality: "senegalesa",
      name: "Senegal",
      originalName: "Senegal",
      code: "SN"
    },
    {
      nationality: "leonesa",
      name: "Serra Leoa",
      originalName: "Sierra Leone",
      code: "SL"
    },
    {
      nationality: "sérvia",
      name: "Sérvia",
      originalName: "Serbia",
      code: "RS"
    },
    {
      nationality: "síria",
      name: "Síria",
      originalName: "Syria",
      code: "SY"
    },
    {
      nationality: "somali",
      name: "Somália",
      originalName: "Somalia",
      code: "SO"
    },
    {
      nationality: "cingalesa",
      name: "Sri Lanka",
      originalName: "Sri Lanka",
      code: "LK"
    },
    {
      nationality: "suazi",
      name: "Suazilândia",
      originalName: "Swaziland",
      code: "SZ"
    },
    {
      nationality: "sudanesa",
      name: "Sudão",
      originalName: "Sudan",
      code: "SD"
    },
    {
      nationality: "sul-sudanês",
      name: "Sudão do Sul",
      originalName: "South Sudan",
      code: "SS"
    },
    {
      nationality: "sueca",
      name: "Suécia",
      originalName: "Sweden",
      code: "SE"
    },
    {
      nationality: "suíça",
      name: "Suíça",
      originalName: "Switzerland",
      code: "CH"
    },
    {
      nationality: "surinamesa",
      name: "Suriname",
      originalName: "Suriname",
      code: "SR"
    },
    {
      nationality: "svalbardense",
      name: "Svalbard",
      originalName: "Svalbard & Jan Mayen",
      code: "SJ"
    },
    {
      nationality: "tadjique",
      name: "Tadjiquistão",
      originalName: "Tajikistan",
      code: "TJ"
    },
    {
      nationality: "tailandesa",
      name: "Tailândia",
      originalName: "Thailand",
      code: "TH"
    },
    {
      nationality: "taiwanês",
      name: "Taiwan",
      originalName: "Taiwan",
      code: "TW"
    },
    {
      nationality: "tanzaniana",
      name: "Tanzânia",
      originalName: "Tanzania",
      code: "TZ"
    },
    {
      nationality: "do território britânico do oceano índico",
      name: "Território Britânico do Oceano índico",
      originalName: "British Indian Ocean Territory",
      code: "IO"
    },
    {
      nationality: "do territórios do sul da frança",
      name: "Territórios do Sul da França",
      originalName: "French Southern Territories",
      code: "TF"
    },
    {
      nationality: "timorense",
      name: "Timor-Leste",
      originalName: "Timor-Leste",
      code: "TL"
    },
    {
      nationality: "togolesa",
      name: "Togo",
      originalName: "Togo",
      code: "TG"
    },
    {
      nationality: "tonganesa",
      name: "Tonga",
      originalName: "Tonga",
      code: "TO"
    },
    {
      nationality: "trinitário-tobagense",
      name: "Trinidad e Tobago",
      originalName: "Trinidad & Tobago",
      code: "TT"
    },
    {
      nationality: "tristanita",
      name: "Tristão da Cunha",
      originalName: "Tristan da Cunha",
      code: "TA"
    },
    {
      nationality: "tunisiana",
      name: "Tunísia",
      originalName: "Tunisia",
      code: "TN"
    },
    {
      nationality: "turcomana",
      name: "Turcomenistão",
      originalName: "Turkmenistan",
      code: "TM"
    },
    {
      nationality: "turca",
      name: "Turquia",
      originalName: "Turkey",
      code: "TR"
    },
    {
      nationality: "tuvaluana",
      name: "Tuvalu",
      originalName: "Tuvalu",
      code: "TV"
    },
    {
      nationality: "ucraniana",
      name: "Ucrânia",
      originalName: "Ukraine",
      code: "UA"
    },
    {
      nationality: "ugandense",
      name: "Uganda",
      originalName: "Uganda",
      code: "UG"
    },
    {
      nationality: "uruguaia",
      name: "Uruguai",
      originalName: "Uruguay",
      code: "UY"
    },
    {
      nationality: "uzbeque",
      name: "Uzbequistão",
      originalName: "Uzbekistan",
      code: "UZ"
    },
    {
      nationality: "vanuatuense",
      name: "Vanuatu",
      originalName: "Vanuatu",
      code: "VU"
    },
    {
      nationality: "vaticano",
      name: "Vaticano",
      originalName: "Vatican City",
      code: "VA"
    },
    {
      nationality: "venezuelana",
      name: "Venezuela",
      originalName: "Venezuela",
      code: "VE"
    },
    {
      nationality: "vietnamita",
      name: "Vietnã",
      originalName: "Vietnam",
      code: "VN"
    },
    {
      nationality: "wallis-futunense",
      name: "Wallis e Futuna",
      originalName: "Wallis & Futuna",
      code: "WF"
    },
    {
      nationality: "zambiana",
      name: "Zâmbia",
      originalName: "Zambia",
      code: "ZM"
    },
    {
      nationality: "zimbabuana",
      name: "Zimbábue",
      originalName: "Zimbabwe",
      code: "ZW"
    }
    ]
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
  sequelize.sync({ alter: true, force: false }).then(() =>
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
