import { includes } from 'lodash';
import {
  AccountPaymentData,
  AdditionalField,
  AdditionalPayment,
  Address,
  Contact,
  Contract,
  Department,
  Document,
  Employee,
  Person,
  EmployeeRole,
  SalaryPackage,
  sequelize,
  WorkingHour,
} from "./index";

import { faker } from '@faker-js/faker';
import PayrollSetting from './Settings/payroll.settings';


type InitializerType = { model: any, data: any[], include?: any }
const initialData: InitializerType[] = [

  {
    model: 'AttendanceType', data: [
      { name: 'Atrasos', code: 'LATENESS' },
      { name: 'Ausências', code: 'ABSENT' },
      { name: 'Férias', code: 'VACATION' },
      { name: 'Horas Extras', code: 'OVERTIME' },
    ]
  },
  {
    model: 'ContactType', data: [
      { code: 'EMAIL', name: 'E-mail' },
      { code: 'LINKEDIN', name: 'LinkedIn' },
      { code: 'TELEPHONE', name: 'Telefone' },
      { code: 'WEBSITE', name: 'Website' },
      { code: 'WHATSAPP', name: 'WhatsApp' },
    ]
  },
  {
    model: 'Department', include: [{
      model: Department, as: 'childs',
      include: [{
        model: Department, as: 'childs',
        include: [{
          model: Department, as: 'childs',
          include: [{
            model: Department, as: 'childs',
            include: [{
              model: Department, as: 'childs',
              include: [{
                model: Department, as: 'childs',
                include: [{
                  model: Department, as: 'childs',
                  include: [{
                    model: Department, as: 'childs',
                    include: [{
                      model: Department, as: 'childs',
                      include: [{
                        model: Department, as: 'childs',
                        include: [{
                          model: Department, as: 'childs',
                          include: [{
                            model: Department, as: 'childs',
                            include: [{ model: Department, as: 'childs' }]
                          }]
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }]
        }]
      }]
    }], data: [
      {

        name: 'Executive Council', code: 'CEX', id: "a04f8f58-0b7d-4ab6-837a-8428e149c7c0",
        childs: [

        ]
      },
      {
        id: "a34f8f58-0b7d-4ab6-837a-8428e149c7c0",
        code: "DTI",
        name: "Direcção de Tecnologia da Informação",
        departmentId: "a04f8f58-0b7d-4ab6-837a-8428e149c7c0",

      },
      {
        id: "c3764843-27f4-47c9-a6a7-5c7917814f72",
        code: "DOP",
        departmentId: "a04f8f58-0b7d-4ab6-837a-8428e149c7c0",
        name: "Direcção de Operações",

      }]
  },
  {
    model: 'Category', data: [
      { id: "00f8b609-21f2-4f53-99df-4db73100a52e", code: '0', name: 'Trainee', no: 0 },
      { id: "10f8b609-21f2-4f53-99df-4db73100a52e", code: '1', name: 'Junior', no: 1 },
      { id: "20f8b609-21f2-4f53-99df-4db73100a52e", code: '2', name: 'Full', no: 2 },
      { id: "30f8b609-21f2-4f53-99df-4db73100a52e", code: '3', name: 'Senior', no: 3 },
      { id: "40f8b609-21f2-4f53-99df-4db73100a52e", code: '4', name: 'Specialist', no: 4 },
    ]
  },
  {
    model: "WITaxTable", data: [
      {
        id: "00f8b600-21f2-4f53-99df-4db73100a52e",
        code: 1, leve: 1,
        fromValue: 0.0000,
        toValue: 100000.00,
        fixedInstallment: 0,
        rate: 0,
        excess: 0
      },
      {
        id: "00f8b601-21f2-4f53-99df-4db73100a52e",
        code: 2, leve: 2,
        fromValue: 100001.00,
        toValue: 150000.00,
        fixedInstallment: 0,
        rate: 13,
        excess: 100001.00
      },
      {
        id: "00f8b602-21f2-4f53-99df-4db73100a52e",
        code: 3, leve: 3,
        fromValue: 150001.00,
        toValue: 200000.00,
        fixedInstallment: 12500,
        rate: 16,
        excess: 150001.00
      },
      {
        id: "00f8b603-21f2-4f53-99df-4db73100a52e",
        code: 4, leve: 4,
        fromValue: 200001.00,
        toValue: 300000.00,
        fixedInstallment: 31250,
        rate: 18,
        excess: 200001.00
      },
      {
        id: "00f8b615-21f2-4f53-99df-4db73100a52e",
        code: 5, leve: 5,
        fromValue: 300001.00,
        toValue: 500000.00,
        fixedInstallment: 49250,
        rate: 19,
        excess: 300001.00
      },
      {
        id: "00f8b614-21f2-4f53-99df-4db73100a52e",
        code: 6, leve: 6,
        fromValue: 500001.00,
        toValue: 1000000.00,
        fixedInstallment: 87250,
        rate: 20,
        excess: 500001.00
      },
      {
        id: "00f8b604-21f2-4f53-99df-4db73100a52e",
        code: 7, leve: 7,
        fromValue: 1000001.00,
        toValue: 1000000.00,
        fixedInstallment: 147249,
        rate: 21,
        excess: 1000001.00
      },
      {
        id: "00f8b605-21f2-4f53-99df-4db73100a52e",
        code: 8, leve: 8,
        fromValue: 1500001.00,
        toValue: 2000000.00,
        fixedInstallment: 292249,
        rate: 22,
        excess: 1500001.00
      },
      {
        id: "00f8b606-21f2-4f53-99df-4db73100a52e",
        code: 9, leve: 9,
        fromValue: 2000001.00,
        toValue: 2500000.00,
        fixedInstallment: 402249,
        rate: 23,
        excess: 2000001.00
      },
      {
        id: "00f8b607-21f2-4f53-99df-4db73100a52e",
        code: 10, leve: 10,
        fromValue: 2_500_001.00,
        toValue: 5_000_000.00,
        fixedInstallment: 517_249,
        rate: 24,
        excess: 2_500_001.00
      },
      {
        id: "00f8b608-21f2-4f53-99df-4db73100a52e",
        code: 11, leve: 11,
        fromValue: 5000001.00,
        toValue: 10000000.00,
        fixedInstallment: 1117249,
        rate: 24.5,
        excess: 5000001.00
      },
      {
        id: "00f8b609-21f2-4f53-99df-4db73100a52e",
        code: 12, leve: 12,
        fromValue: 10000001.00,
        toValue: 0,
        fixedInstallment: 2342248,
        rate: 25,
        excess: 10000001.00
      }
    ]
  },
  {
    model: 'EmployeeRole', data: [
      { id: "00f8b609-21f2-4f53-99df-4db73100a52e", code: '1', name: 'Project manager' },
      { id: "13f8b609-21f2-4f53-99df-4db73100a52e", code: '2', name: 'Software Architect' },
      { id: "23f8b609-21f2-4f53-99df-4db73100a52e", code: '3', name: 'Data science' },
      { id: "33f8b609-21f2-4f53-99df-4db73100a52e", code: '4', name: 'Front-end web development' },
      { id: "43f8b609-21f2-4f53-99df-4db73100a52e", code: '5', name: 'Software Testing' },
      { id: "53f8b609-21f2-4f53-99df-4db73100a52e", code: '6', name: 'Product Manager' },
      { id: "63f8b609-21f2-4f53-99df-4db73100a52e", code: '7', name: 'System Administrator' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52e", code: '8', name: 'Marketing' },
      { id: "89f8b609-21f2-4f53-99df-4db73100a52e", code: '9', name: 'Data analysis' },
      { id: "93f8b609-21f2-4f53-99df-4db73100a52e", code: '10', name: 'Technical Project Manager' },
      { id: "03f8b609-21f2-4f53-99df-4db73100a52e", code: '11', name: 'Machine learning' },
      { id: "81f8b609-21f2-4f53-99df-4db73100a52e", code: '12', name: 'Sales engineering' },
      { id: "82f8b609-21f2-4f53-99df-4db73100a52e", code: '13', name: 'Developer Analyst - Trainee' },
      { id: "83f8b609-21f2-4f53-99df-4db73100a52e", code: '14', name: 'Developer Analyst - Junior' },
      { id: "84f8b609-21f2-4f53-99df-4db73100a52e", code: '15', name: 'Developer Analyst - Full' },
      { id: "85f8b609-21f2-4f53-99df-4db73100a52e", code: '16', name: 'Developer Analyst - Senior' },
      { id: "86f8b609-21f2-4f53-99df-4db73100a52e", code: '17', name: 'Assistente Comercial I' },
      { id: "87f8b609-21f2-4f53-99df-4db73100a52e", code: '18', name: 'Assistente Comercial II' },
      { id: "88f8b609-21f2-4f53-99df-4db73100a52e", code: '19', name: 'Assistente Comercial III' },
      { id: "89f0b609-21f2-4f53-99df-4db73100a52e", code: '20', name: 'Commercial Manager' },
    ]
  },
  {
    model: 'RoleModule', data: [
      { id: "00f8b609-21f2-4f53-99df-4db73100a52e", name: "employee", code: 12 },
      { id: "86f8b609-21f2-4f53-99df-4db73100a52e", name: "payroll", code: 21 },
      { id: "87f8b609-21f2-4f53-99df-4db73100a52e", name: "attendance", code: 31 },
      { id: "89f0b609-21f2-4f53-99df-4db73100a52e", name: "settings", code: 13 }
    ]
  },
  {
    model: 'PayrollStatus', data: [
      { code: 0, descriptions: 'Aberto' },
      { code: 1, descriptions: 'Analise  ' },
      { code: 2, descriptions: 'Confirmação' },
      { code: 3, descriptions: 'Aprovação' },
      { code: 4, descriptions: 'Execução' },
    ]
  },
  {
    model: 'AdditionalPaymentType', data: [

      { id: "00f8b609-21f2-4f53-99df-4db73100a52e", code: '1000', name: 'Vencimento Base', level: 1 },
      { id: "13f8b609-21f2-4f53-99df-4db73100a52e", code: '1401', level: 0, name: 'Subsídio de Alimentação' },
      { id: "23f8b609-21f2-4f53-99df-4db73100a52e", code: '1406', level: 0, name: 'Subsídio de Competitividade' },
      { id: "33f8b609-21f2-4f53-99df-4db73100a52e", code: 'BN', level: 0, name: 'Bônus' },
      { id: "43f8b609-21f2-4f53-99df-4db73100a52e", code: 'HE', level: 0, name: 'Horas extras' },
      { id: "53f8b609-21f2-4f53-99df-4db73100a52e", code: 'AS', level: 0, name: 'Adiantamento salarial' },
      { id: "63f8b609-21f2-4f53-99df-4db73100a52e", code: 'TF', level: 0, name: 'Trabalho em feriados' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52e", code: 'HD', level: 0, name: 'Feriados' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52a", code: '1630', level: 0, name: 'Subsídio de Férias' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52b", code: '1642', level: 0, name: 'Subsídio de Natal' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52c", code: 'STR', level: 0, name: 'Subsídio de Turno' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52d", code: 'SCE', level: 0, name: 'Subsídio de Condições Especiais de Trabalho' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52e", code: 'SEM', level: 0, name: 'Subsídio de Enfermidade ou Maternidade' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52f", code: 'SED', level: 0, name: 'Subsídio de Educação' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a50e", code: 'SAS', level: 0, name: 'Subsídio de Ação Social' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a59e", code: 'PDS', level: 0, name: 'Prémios de Desempenho' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a08e", code: 'SAF', level: 0, name: 'Subsídio de Apoio à Família' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a58e", code: '1603', level: 0, name: 'Subsídio de abono Famíliar' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a57e", code: 'SNT', level: 0, name: 'Subsídio Noturno' },
      { id: "89f8b609-21f2-4f53-99df-4db73100a52e", code: 'HE', level: 0, name: 'Horas extras' },
      { id: "93f8b609-21f2-4f53-99df-4db73100a52e", code: 'VA', level: 0, name: 'Remuneração Variável' },
      { id: "03f8b609-21f2-4f53-99df-4db73100a52e", code: 'CM', level: 0, name: 'Comissões' },
      { id: "81f8b609-21f2-4f53-99df-4db73100a52e", code: 'CP', level: 0, name: 'Complemento' },
      { id: "82f8b609-21f2-4f53-99df-4db73100a52e", code: 'DS', level: 0, name: 'Subsídio de Disponibilidade' },
      { id: "83f8b609-21f2-4f53-99df-4db73100a52e", code: 'AC', level: 0, name: 'Subsídio de Acomodação' },
      { id: "84f8b609-21f2-4f53-99df-4db73100a52e", code: '1402', level: 0, name: 'Subsídio de Transporte' },
      { id: "85f8b609-21f2-4f53-99df-4db73100a52e", code: 'ET', level: 0, name: 'Subsídio de Espaço de trabalho' },
      { id: "87f8b609-21f2-4f53-99df-4db73100a52e", code: 'AP', level: 0, name: 'Subsídio de Aprendizado' },
      { id: "88f8b609-21f2-4f53-99df-4db73100a52e", code: 'OU', level: 0, name: 'Outro Subsídio' }
    ]
  },
  {
    model: 'Business', data: [
      { code: '1', name: 'Lavandaria' },
      { code: '2', name: 'Cinema' },
      { code: '3', name: 'Hospital' },
      { code: '4', name: 'Clínica' },
      { code: '5', name: 'Cabeleireiro' },
      { code: '6', name: 'Estética' },
      { code: '7', name: 'Mecânica' },
      { code: '8', name: 'Restaurante' },
      { code: '9', name: 'Supermercado' },
      { code: '10', name: 'Hotelaria' },
      { code: '11', name: 'Fábrica' },
      { code: '12', name: 'Armarinho' },
      { code: '13', name: 'Loja' },
      { code: '14', name: 'Saúde' },
      { code: '15', name: 'Educação e Ensino' },
      { code: '16', name: 'Outro' }
    ]
  },
  {
    model: 'Country', data: [{
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
      id: "83f8b609-21f2-4f53-99df-4db73100a52e",
      nationality: "andorrana",
      name: "Andorra",
      originalName: "Andorra",
      code: "AD"
    },
    {
      id: "13f8b609-21f2-4f53-99df-4db73100a52e",
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
      id: "13f8b609-21f2-4f53-99df-4db73100a00e",
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
      id: "93f8b609-21f2-4f53-99df-4db73100a52e",
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
      nationality: "portorriquenha",
      name: "Porto Rico",
      originalName: "Puerto Rico",
      code: "PR"
    },
    {
      id: "13f8b609-21f2-4f53-99df-4db73100a11e",
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
      id: "13f8b609-21f2-4f53-99df-4db73100a22e",
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
    model: 'Company', data: [
      {
        code: 'A',
        name: faker.company.name(),
        description: faker.person.bio(),
        nif: faker.finance.accountNumber(),
        socialCapital: faker.finance.amount(),
        integrationToken: '',
        slogan: faker.company.buzzPhrase(),
        logos: faker.image.avatarGitHub(),
        startActivityDate: '2023-06-10',
        address: [{
          descriptions: faker.location.streetAddress(),
          city: faker.location.city(),
          province: faker.location.state(),
          countryId: '13f8b609-21f2-4f53-99df-4db73100a52e',
        }],
        isActive: false,
        business: { code: '17', name: faker.commerce.department() }
      }]
  },
  {
    model: 'Bank', data:
      [
        { id: '00f5236e-7192-4ef3-96bc-5485666c6435', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Angolano de Negócios e Comércio', code: 'BANC' },
        { id: '0b2dfe5f-fc47-456f-a3f8-de4d5958559d', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Regional do Keve', code: 'Keve' },
        { id: '0f5a7108-aa63-49b7-8ee7-01c3453cc480', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Angolano de Investimentos', code: 'BAI' },
        { id: '1b084b4a-7a7c-41c1-847f-9be817fde214', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco de Fomento Angola', code: 'BFA' },
        { id: '2c8945ce-c7c9-4ccd-aea1-32a1d456da13', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Finibanco Angola', code: 'Finibanco' },
        { id: '471a5502-efe8-40bd-b95d-fee6315b6b7b', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Standard Bank de Angola', code: 'SBA' },
        { id: '4897a994-6ded-4a54-80ee-f218c7803dab', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco de Negocios Internacional', code: 'BNI' },
        { id: '5a403513-5e00-4308-a92d-4e05078fe484', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Millennium Atlântico', code: 'BMA' },
        { id: '8d92a5c6-221d-4512-a903-a224e71f1f0c', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Sol', code: 'SOL' },
        { id: '8e0239f7-cf3c-446d-b47e-1cf34220d14f', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco de Poupanca e Credito', code: 'BPC' },
        { id: '9086748d-e706-4ac1-ba52-0a0d24a03bd4', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Comercial Angolano', code: 'BCA' },
        { id: '9f9702c1-a382-4018-9e60-31474618c6e7', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Comercial do Huambo', code: 'BCH' },
        { id: 'b1f75590-b87a-4355-9ac8-dde427c9a6bf', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco de Comércio e Indústria', code: 'BCI' },
        { id: 'bac2f1a3-24c4-4169-81c4-133c70a702cd', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco de Investimento Rural', code: 'BIR' },
        { id: 'cc4da0a6-b59b-452d-aa9a-9eea5c3b5f64', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Caixa Geral Angola', code: 'BCGA' },
        { id: 'd09183db-ca9d-4958-ab13-07ed3e31897b', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco Económico', code: 'Economico' },
        { id: 'd1afba1f-6fdb-4f24-9b84-1297c11df19b', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco BIC', code: 'BIC' },
        { id: 'f60f722e-8ef2-4034-90e8-2352d6f3da51', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco BAI Microfinanças', code: 'BMF' },
        { id: 'fcbb10be-e074-401c-9f9b-29a07196d0c2', countryId: '13f8b609-21f2-4f53-99df-4db73100a52e', name: 'Banco de Desenvolvimento de Angola', code: 'BDA' }
      ]
  },
  { model: 'Sequence', data: [{ code: 'Employee', sequence: 1 }] },
  {
    model: 'Setting', data: [
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
  },
  {
    model: 'PayrollSetting', data: [{
      name: 'PST',
      code: 'PST',
      paymentDay: 30,
      absenceCount: false,
      absencePercent: 0,
      overtimeCount: false,
      overtimePercent: 0
    }]
  }
]


function createRandomEmployees(): any {
  let employees: any[] = [];


  const flatten = (item: any): any => {
    const { id, childs, code, name }: any = item;
    const flattened = [];
    flattened.push({ id, code, name });

    if (childs && childs.length > 0) {
      for (const child of childs) {
        for (const c of flatten(child))
          flattened.push(c);
      }
    }
    return flattened;
  }

  const y = initialData?.filter(({ model }: any) => model === 'Department').flat(1)[0].data;
  let departments: any[] = []
  departments.push(flatten(y[0]))
  departments.push(flatten(y[1]))
  departments.push(flatten(y[2]))
  departments = departments.flat(1)

  const roles: any[] = initialData?.find(({ model }: any) => model === 'EmployeeRole')?.data ?? []
  const types: any[] = initialData?.find(({ model }: any) => model === 'AdditionalPaymentType')?.data ?? []
  const contactType: any[] = initialData?.find(({ model }: any) => model === 'ContactType')?.data ?? []
  const countries: any[] = initialData?.find(({ model }: any) => model === 'Country')?.data.filter(({ id }: any) => id) ?? []
  const categories: any[] = initialData?.find(({ model }: any) => model === 'Category')?.data.filter(({ id }: any) => id) ?? []
  const banks: any[] = initialData?.find(({ model }: any) => model === 'Bank')?.data ?? []


  const accountPaymentDatas = (i: number) =>
    [...Array(i + 1).keys()].map(() => ({
      iban: faker.finance.iban(),
      number: faker.finance.accountNumber(),
      bankId: faker.helpers.arrayElement(banks?.map(({ id }: any) => id)),
      currency: faker.finance.currencyCode(),
      swift: faker.finance.bic(),
      countryId: faker.helpers.arrayElement(countries?.filter(({ id }) => id)?.map(({ id }: any) => id))
    }))
  //accountPaymentDatas((faker.number.int(2))).map((x: any) => AccountPaymentData.create(x))

  const generateEmployee = (key: number) => {

    let weekDays = ["Mo", "Tu", "We", "Th", "Fr"];
    (Math.floor(Math.random() * 10) > 2) && weekDays.push('Sa')
    return {
      code: 'A' + String(key).padStart(7, '0'),
      isActive: faker.datatype.boolean(0.8),
      descriptions: faker.lorem.paragraph(),
      type: "INT",
      avatar: faker.image.avatar(),
      accounts: accountPaymentDatas((faker.number.int(2))),
      person: {
        socialSecurityNumber: faker.finance.accountNumber(),
        firstName: faker.person.firstName(),
        otherNames: faker.person.middleName(),
        lastName: faker.person.lastName(),
        descriptions: faker.person.bio(),
        title: faker.person.prefix(),
        maritalStatus: faker.helpers.arrayElement(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"]),
        gender: ['M', 'W'][faker.datatype.boolean(0.8) ? 0 : 1],
        birthDate: faker.date.birthdate(),
        nationalityId: faker.helpers.arrayElement(countries?.map(({ id }: any) => id)),
        birthPlaceAddress: {
          descriptions: faker.location.streetAddress(),
          city: faker.location.city(),
          province: faker.location.state(),
          countryCode: faker.location.countryCode(),
          countryId: faker.helpers.arrayElement(countries?.map(({ id }: any) => id)),
        },
        livingAddress: {
          descriptions: faker.location.streetAddress(),
          city: faker.location.city(),
          province: faker.location.state(),
          countryCode: faker.location.countryCode(),
          countryId: faker.helpers.arrayElement(countries?.map(({ id }: any) => id)),
        }
      },
      contacts: [
        {
          descriptions: faker.internet.email(),
          typeId: contactType?.find(({ code }: any) => code === 'EMAIL')?.id
        },
        {
          descriptions: faker.internet.email(),
          typeId: contactType?.find(({ code }: any) => code === 'EMAIL')?.id
        },
        {
          descriptions: faker.phone.number(),
          typeId: contactType?.find(({ code }: any) => code === "PHONENUMBER")?.id
        }
      ],
      documents: [
        {
          type: "IDCARD",
          number: faker.finance.accountNumber()
        }
      ],
      contracts: [
        {
          roleId: faker.helpers.arrayElement(roles?.map(({ id }: any) => id)),
          categoryId: faker.helpers.arrayElement(categories?.map(({ id }: any) => id)),
          departmentId: faker.helpers.arrayElement(departments?.map(({ id }: any) => id)),
          startDate: faker.date.past(),
          endDate: faker.date.future({ refDate: '2024-01-01T00:00:00.000Z' }),
          type: faker.helpers.arrayElement(["F", "H"]),
          salaryPackage: {
            baseValue: faker.finance.amount({ min: 100000, max: 500000, dec: 2 }),
            baseValuePeriod: 3,
            startDate: faker.date.past(),
            additionalPayments: [
              {
                baseValue: faker.finance.amount({ min: 10000, max: 50000, dec: 2 }),
                baseValuePeriod: faker.number.int(3),
                startDate: faker.date.past({ refDate: '2023-01-01T00:00:00.000Z' }),
                typeId: faker.helpers.arrayElement(types?.map(({ id }: any) => id))
              }
            ]
          },
          workingHour: {
            period: faker.number.int(3),
            hours: faker.number.int({ min: 30, max: 60 }),
            weekDays
          }
        }
      ]
    }
  }
  let i = 120;
  while (--i >= 0 && employees.push(generateEmployee(i))) { }
  initialData.push({
    model: 'Employee', data: employees, include:
      [Contact, AccountPaymentData,
        Document,
        {
          model: Person, include: [
            { model: Address, as: 'birthPlaceAddress' },
            { model: Address, as: 'livingAddress' }]
        },
        {
          model: Contract, include: [
            AdditionalField,
            WorkingHour,
            { model: SalaryPackage, include: [AdditionalPayment] },
          ]
        }]
  });
}

createRandomEmployees();

const initializer = (_?: any) =>
  initialData.forEach(({ model: m, data, include = { all: true } }: any) => {
    const s = sequelize;
    let model: any = s.models[`${m}`];

    data.forEach(async (d: any, i: number) => {

      model?.findOne({ where: { code: d?.code } }).then((f: any) => {
        if (f === null) {
          if (m === 'Employee') {
            let y = 9
          }
          model.create(d, { include: include ?? { all: true } }).catch((e: any) => {
            console.log(e)
          })
        }
      }).catch(console.log)
    })
  })






export { initializer }