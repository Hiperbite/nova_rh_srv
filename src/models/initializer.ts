import { boolean } from 'zod';

import sequelize, {
  Country,
  Role,
  PayrollStatus,
  AdditionalPaymentType,
  Department,
  Company,
  Setting,
  Business,
  Employee,
  Sequence
} from "./index";

import { faker } from '@faker-js/faker';


const initialData: any = [
  {
    model: Department, include: [{
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
    }], data: [
      {

        name: 'Executive Council', code: 'CEX', id: "a04f8f58-0b7d-4ab6-837a-8428e149c7c0",
        childs: [
          {
            id: "a34f8f58-0b7d-4ab6-837a-8428e149c7c0",
            code: "DTI",
            name: "Diretoria de Tecnologia da Informação",
            childs: [
              {
                id: "d1f8f162-0e9f-428e-9329-1448906056cf",
                code: "DEV",
                name: "Departamento de Desenvolvimento de Software",
                childs: [
                  {
                    id: "b3a9e4c2-6891-44e3-a6b2-70c09d5438d0",
                    code: "DWE",
                    name: "Subdepartamento de Desenvolvimento Web",
                    childs: [
                      { id: "8f5d59e6-9922-4ae0-87a1-15c7e4a22a4e", code: "FE", name: "Equipe de Frontend" },
                      { id: "d42dbb4b-b70d-4e35-9279-07b0b947cd8a", code: "BE", name: "Equipe de Backend" }
                    ]
                  },
                  {
                    id: "83f8b609-21f2-4f53-99df-4db73100a52e",
                    code: "DMO",
                    name: "Subdepartamento de Desenvolvimento de Aplicativos Móveis",
                    childs: [
                      { id: "c68511b9-bfeb-4f3f-9cfe-76b40f9b8d91", code: "iOS", name: "Equipe de iOS" },
                      { id: "daebcfda-3e6b-4a61-91b7-0d42530ef3c9", code: "AND", name: "Equipe de Android" }
                    ]
                  },
                  {
                    id: "a87abeca-d35f-41f4-af36-57db93e7b7f2",
                    code: "ARS",
                    name: "Subdepartamento de Arquitetura de Software",
                    childs: [
                      { id: "04f1f990-63f5-40a6-8371-0e74ab806500", code: "MIC", name: "Arquitetura de Microserviços" },
                      { id: "3a7b1982-58be-4b27-bb61-1330c26bb68b", code: "NUV", name: "Arquitetura de Nuvem" }
                    ]
                  }
                ]
              },
              {
                id: "5d9536bb-3cb7-4d7b-ba96-19ac19f10b2c",
                code: "INF",
                name: "Departamento de Infraestrutura e Operações",
                childs: [
                  {
                    id: "1d0d7db4-61b7-402d-9b12-944ec8184c75",
                    code: "RES",
                    name: "Subdepartamento de Redes e Segurança",
                    childs: [
                      { id: "06b46b7c-9c23-4ad4-a4f0-49a0a063b6dd", code: "RED", name: "Equipe de Rede" },
                      { id: "af2b33a0-dc14-45ed-9a7b-95f2e3f04f63", code: "SEC", name: "Equipe de Segurança Cibernética" }
                    ]
                  },
                  {
                    id: "1e09e388-12b9-475c-b57a-7c2d4d2e84d4",
                    code: "ADM",
                    name: "Subdepartamento de Administração de Sistemas",
                    childs: [
                      { id: "8e460ba9-c9da-4774-8dd3-5db432c82177", code: "ADM", name: "Equipe de Administração de Servidores" },
                      { id: "a0216076-abea-4c8c-8a24-5082be8c12a2", code: "DVO", name: "Equipe de DevOps" }
                    ]
                  },
                  {
                    id: "b549b112-b53b-4f14-aa11-3804064b0487",
                    code: "GER",
                    name: "Subdepartamento de Gerenciamento de Ativos",
                    childs: [
                      { id: "1cf50a00-378f-472b-8c33-977c036572fe", code: "HRD", name: "Controle de Ativos de Hardware" },
                      { id: "17e156f0-6a2e-4565-85b3-57b50590bbf7", code: "SFT", name: "Gerenciamento de Licenças de Software" }
                    ]
                  }
                ]
              },
              {
                id: "045e756c-0b81-4c84-875b-1a48458c9ef6",
                code: "DIA",
                name: "Departamento de Análise de Dados e Inteligência Artificial",
                childs: [
                  {
                    id: "2b405b19-6166-4b5a-8b86-055632b01d6e",
                    code: "CID",
                    name: "Subdepartamento de Ciência de Dados",
                    childs: [
                      { id: "f424819e-7d13-48c6-b6ef-30e7b902db8d", code: "AND", name: "Equipe de Análise de Dados" },
                      { id: "bd90d0f6-4881-4c19-86de-01b5e32056d3", code: "APM", name: "Equipe de Aprendizado de Máquina" }
                    ]
                  },
                  {
                    id: "b663dc4f-6605-4d7f-bcbf-3eb35413c0d9",
                    code: "INT",
                    name: "Subdepartamento de Inteligência de Negócios",
                    childs: [
                      { id: "021ab18d-9a3b-46c1-9ec3-9924c08f9cc4", code: "BI", name: "Equipe de Business Intelligence" },
                      { id: "cd076d0d-d6fc-4c6d-9c91-cd62806ad3a5", code: "VIS", name: "Equipe de Visualização de Dados" }
                    ]
                  }
                ]
              },
              {
                id: "27f47214-8b20-434a-b6d2-8ed3981e2f29",
                code: "UXD",
                name: "Departamento de Experiência do Usuário e Design",
                childs: [
                  {
                    id: "0c670eda-20e6-4c4c-b1b0-3c22e7d5ea1c",
                    code: "UXD",
                    name: "Subdepartamento de Experiência do Usuário",
                    childs: [
                      { id: "a39d433d-094c-4657-b2f2-1d10d7abcb6e", code: "PES", name: "Equipe de Pesquisa de Usuário" },
                      { id: "33f0e63a-4d53-4096-9f59-29eb43f2e5ca", code: "DIN", name: "Equipe de Design de Interação" }
                    ]
                  },
                  {
                    id: "af6a656d-40f3-4314-8b92-179e2c25ef2d",
                    code: "DSV",
                    name: "Subdepartamento de Design Visual",
                    childs: [
                      { id: "b0c65b8f-d01e-4b7c-b0da-c6d620b7e2c6", code: "GRA", name: "Equipe de Design Gráfico" },
                      { id: "0ee03ff3-cd4d-4596-b46b-4c659b7482a0", code: "INT", name: "Equipe de Design de Interface" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: "c3764843-27f4-47c9-a6a7-5c7917814f72",
            code: "DOP",
            name: "Diretoria de Operações",
            childs: [
              {
                id: "6a2ea521-4c9b-4fe0-a9f4-9c6b41670067",
                code: "VEM",
                name: "Departamento de Vendas e Marketing",
                childs: [
                  {
                    id: "19a237b6-44e5-4160-b9aa-42c1530f0a3b",
                    code: "VEN",
                    name: "Subdepartamento de Vendas",
                    childs: [
                      { id: "61c7b7e2-3f5b-4b7f-aa2b-e48eb7c3beab", code: "B2B", name: "Equipe de Vendas B2B" },
                      { id: "5602ee8b-8de5-47a7-95a1-7e5e7e8c08a2", code: "B2C", name: "Equipe de Vendas B2C" }
                    ]
                  },
                  {
                    id: "7647f9ad-ea40-4e58-b849-6aa6bbd8aa4d",
                    code: "MKT",
                    name: "Subdepartamento de Marketing",
                    childs: [
                      { id: "df0f189b-4eac-4e58-90c5-31dd4633fb48", code: "DIG", name: "Equipe de Marketing Digital" },
                      { id: "b0d43e08-3637-4f6e-9b6e-07ac8b3a49cd", code: "CON", name: "Equipe de Marketing de Conteúdo" }
                    ]
                  }
                ]
              },
              {
                id: "bb55d617-3c4d-4a79-b4b0-e16b1d85a4d0",
                code: "FAD",
                name: "Departamento Financeiro e Administrativo",
                childs: [
                  {
                    id: "e1a0e6b3-4d91-46ce-aacb-176d8a5d0ff1",
                    code: "CON",
                    name: "Subdepartamento de Contabilidade",
                    childs: [
                      { id: "89b69fbf-cb65-4a9d-a02a-b33d91fdd24c", code: "CPG", name: "Equipe de Contas a Pagar e Receber" },
                      { id: "33245f6b-eeb2-4564-9324-9479c2710b92", code: "CGE", name: "Equipe de Contabilidade Geral" }
                    ]
                  },
                  {
                    id: "b2d9f112-c3ac-4fa9-8895-90c9f29b5974",
                    code: "PLF",
                    name: "Subdepartamento de Planejamento Financeiro",
                    childs: [
                      { id: "a9749796-cda4-409c-85e4-b967635ada73", code: "ORÇ", name: "Equipe de Orçamento" },
                      { id: "54dd847e-020a-4e61-8a3e-0aa062012e5e", code: "AFN", name: "Equipe de Análise Financeira" }
                    ]
                  },
                  {
                    id: "8e0d8e15-0ff5-4d13-b363-688b9be13551",
                    code: "RHP",
                    name: "Subdepartamento de Recursos Humanos",
                    childs: [
                      { id: "7c14f8af-0f92-4d09-b5d3-36b76d7f2c3b", code: "RCS", name: "Equipe de Recrutamento e Seleção" },
                      { id: "8b322ff0-322e-4d19-92a0-6f632f67c5a3", code: "DPS", name: "Equipe de Desenvolvimento de Pessoas" },
                      { id: "3df9e3c9-1e8b-4c9b-bf83-65ecd039f6db", code: "APE", name: "Equipe de Administração de Pessoal" }
                    ]
                  }
                ]
              }
            ]
          }

        ]
      }]
  },
  {
    model: Role, data: [
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
    model: PayrollStatus, data: [
      { code: 0, descriptions: 'Aberto' },
      { code: 1, descriptions: 'Analise  ' },
      { code: 2, descriptions: 'Confirmação' },
      { code: 3, descriptions: 'Aprovação' },
      { code: 4, descriptions: 'Execução' },
    ]
  },
  {
    model: AdditionalPaymentType, data: [

      { id: "00f8b609-21f2-4f53-99df-4db73100a52e", code: '1000', name: 'Vencimento Base', level: 1 },
      { id: "13f8b609-21f2-4f53-99df-4db73100a52e", code: '1401', level: 0, name: 'Almoço' },
      { id: "23f8b609-21f2-4f53-99df-4db73100a52e", code: '1406', level: 0, name: 'Competitividade' },
      { id: "33f8b609-21f2-4f53-99df-4db73100a52e", code: 'BN', level: 0, name: 'Bônus' },
      { id: "43f8b609-21f2-4f53-99df-4db73100a52e", code: 'HE', level: 0, name: 'Horas extras' },
      { id: "53f8b609-21f2-4f53-99df-4db73100a52e", code: 'AS', level: 0, name: 'Adiantamento salarial' },
      { id: "63f8b609-21f2-4f53-99df-4db73100a52e", code: 'TF', level: 0, name: 'Trabalho em feriados' },
      { id: "73f8b609-21f2-4f53-99df-4db73100a52e", code: 'VC', level: 0, name: 'Feriados' },
      { id: "89f8b609-21f2-4f53-99df-4db73100a52e", code: 'HE', level: 0, name: 'Horas extras' },
      { id: "93f8b609-21f2-4f53-99df-4db73100a52e", code: 'VA', level: 0, name: 'Variável' },
      { id: "03f8b609-21f2-4f53-99df-4db73100a52e", code: 'CM', level: 0, name: 'Comissões' },
      { id: "81f8b609-21f2-4f53-99df-4db73100a52e", code: 'CP', level: 0, name: 'Complemento' },
      { id: "82f8b609-21f2-4f53-99df-4db73100a52e", code: 'DS', level: 0, name: 'Disponibilidade' },
      { id: "83f8b609-21f2-4f53-99df-4db73100a52e", code: 'AC', level: 0, name: 'Acomodação' },
      { id: "84f8b609-21f2-4f53-99df-4db73100a52e", code: 'TR', level: 0, name: 'Transporte' },
      { id: "85f8b609-21f2-4f53-99df-4db73100a52e", code: 'ET', level: 0, name: 'Espaço de trabalho' },
      { id: "86f8b609-21f2-4f53-99df-4db73100a52e", code: 'RF', level: 0, name: 'Refeição' },
      { id: "87f8b609-21f2-4f53-99df-4db73100a52e", code: 'AP', level: 0, name: 'Aprendizado' },
      { id: "88f8b609-21f2-4f53-99df-4db73100a52e", code: 'OU', level: 0, name: 'Outro' }
    ]
  },
  {
    model: Business, data: [
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
    ]
  },
  {
    model: Company, data: [
      {
        code: 'A',
        name: '',
        description: '',
        nif: '',
        socialCapital: 0,
        integrationToken: '',
        slogan: '',
        logos: '',
        business: { code: '16', name: 'Outro' }
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
  { model: Sequence, data: [{ code: 'Employee', sequence: 1 }] },
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


function createRandomEmployees(): any {
  let employees: any[] = [];


  const flatten = (item: any): any => {
    const { id, childs, code, name } = item;
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


  const generateEmployee = (key: number) => {
    const departments: any[] = flatten(initialData?.find(({ model }: any) => model.name === 'Department')?.data[0]) ?? []
    const roles: any[] = initialData?.find(({ model }: any) => model.name === 'Role')?.data ?? []
    const types: any[] = initialData?.find(({ model }: any) => model.name === 'AdditionalPaymentType')?.data ?? []
    const countries: any[] = initialData?.find(({ model }: any) => model.name === 'Country')?.data ?? []
    return {
      code: 'A' + String(key).padStart(7, '0'),
      isActive: faker.datatype.boolean(0.8),
      descriptions: faker.lorem.paragraph(),
      type: "INT",
      avatar: faker.image.avatar(),
      person: {
        nationality: faker.location.county(),
        firstName: faker.person.firstName(),
        otherName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        gender: faker.person.gender(),
        birthDate: faker.date.birthdate(),
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
          type: "EMAIL"
        },
        {
          descriptions: faker.internet.email(),
          type: "EMAIL"
        },
        {
          descriptions: faker.phone.number('+244 9########'),
          type: "PHONENUMBER"
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
          departmentId: faker.helpers.arrayElement(departments?.map(({ id }: any) => id)),
          startDate: faker.date.past(),
          endDate: faker.date.future({ refDate: '2024-01-01T00:00:00.000Z' }),
          type: "F",
          salaryPackage: {
            baseValue: faker.finance.amount({ min: 100000, max: 500000, dec: 2 }),
            baseValuePeriod: 3,
            startDate: faker.date.past(),
            additionalPayments: [
              {
                baseValue: faker.finance.amount({ min: 10000, max: 50000, dec: 2 }),
                baseValuePeriod: 2,
                startDate: faker.date.past({ refDate: '2023-01-01T00:00:00.000Z' }),
                typeId: faker.helpers.arrayElement(types?.map(({ id }: any) => id))
              }
            ]
          }
        }
      ]
    }
  }


  let i = 100;
  while (--i > 0 && employees.push(generateEmployee(i))) { }
  initialData.push({ model: Employee, data: employees });
}

createRandomEmployees();

const initializer = (_?: any) =>
  initialData.forEach(({ model, data, include = { all: true } }: any) => data.forEach(async (d: any) => {
    model.findOne({ where: { code: d.code } }).then((f: any) => {
      if (f === null) {
        if (include) {
          let v = 0;
        }
        model.create(d, { include }).catch((e: any) => {

          let y = e;
          console.log(e)

        })
      }
    }).catch((e: any) => {

      let y = e;
      console.log(e)

    })
  }))



export { initializer }