import { DocumentTypeSetting } from '../../../models';

import { number } from 'zod';
import moment from 'moment';
import { novaIcon } from '../../../public/assets/imgs/index';
import PdfPrinter from 'pdfmake';

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");

var htmlToPdfmake = require("html-to-pdfmake");


import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AccountPaymentData, Address, Company, Contact, Employee, PayStub, Currency } from '../../../models/index';
import { toDataURL } from '../../../routes/hendlers';



//let USDollar =
export const currency = (value: number = 0, { currency, tax }: any = { currency: 'AOA', tax: 1 }) => (new Intl.NumberFormat('pt-PT',
  { style: 'currency', currency },
)).format(value * tax);

const documents: any = {
  IDCARD: "Bilhete de Identidade",
  PASSPORT: "Passaporte"
}
const tableLayouts = {
  exampleLayout: {
    hLineWidth: function (i: number, node: any) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return (i === node.table.headerRows) ? 2 : 1;
    },
    vLineWidth: function (i: number) {
      return 0;
    },
    hLineColor: function (i: number) {
      return i === 1 ? 'black' : '#aaa';
    },
    paddingLeft: function (i: number) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i: number, node: any) {
      return (i === node.table.widths.length - 1) ? 0 : 8;
    }
  }
};
async function getDocDefinitions({ employeeId, data }: any): Promise<TDocumentDefinitions> {

  const employee = await Employee.scope('all').findByPk(employeeId)
  const [company] = await Company.findAll();
  const document: any = employee?.idCard || employee?.passport
  const parseValue = (v: number) => v
  const logo = company?.logos?.includes('http')
    ? await toDataURL(company?.logos ?? '')
    : company?.logos



  const { body }: any = await DocumentTypeSetting.findOne()

  const html = htmlToPdfmake(textComposer(body, { employee, company }), { window: window });
  return {

    pageMargins: [80, 60, 80, 60],
    content: [html],
    footer: [


      {
        text: 'Declaração de trabalho',

        alignment: 'center',
        style: 'lowFooter',

      },
      {
        text: moment().format('YYYYMMDD'),

        alignment: 'center',
        style: 'lowFooter',

      },
    ]

    ,
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 15,
        bold: true,
        alignment: 'center',
        marginTop: 35,
        marginBottom: 15,
        decoration: "underline"
      },
      body: {
        fontSize: 12,
        bold: false,
        alignment: 'justify',
        lineHeight: 1.5,
      },
      footer: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
      },
      lowFooter: {
        fontSize: 9,
      }
    },

  }

}

async function getContractDefinitions({ employeeId, data }: any): Promise<TDocumentDefinitions> {

  const employee = await Employee.scope('all').findByPk(employeeId)

  const [company] = await Company.findAll();
  const document: any = employee?.idCard || employee?.passport

  const [address]: Address[] = company?.address ?? [new Address];

  const g = employee?.person?.gender == 'M'
  return {


    content: [
      {
        text: 'CONTRATO DE TRABALHO',
        style: 'header',
        alignment: 'center',

      },
      {
        text: 'Entre'
      },
      {
        text: [
          company?.name + '',
          ', com sede em ',
          (company?.address ?? [{}])[0]?.fullAddress + '',
          ' contribuinte fiscal n° ',
          company?.nif + '',
          ', com o Capital Social de ',
          currency(company?.socialCapital) + '',
          ', matriculado na Conservatória do Registo Comercial de Luanda, aqui representado pelos Administradores, adiante designado por "EMPREGADOR".']
      },
      { text: 'E' },
      {
        text: [
          employee?.person?.fullName + ', ',
          employee?.person?.maritalStatus + ', ',
          employee?.person?.nationality?.nationality + ', ',
          'portador (a) do ', documents[document?.type], ' n.° ',
          document?.number + ', ',
          ' emitido em 19/07/2017, válido até 18/07/2026,',
          ' contribuinte fiscal n° ',
          document?.number + ', ',
          ' residente ',
          employee?.person?.livingAddress?.fullAddress + ' ',
          (employee?.person?.gender == 'M' ?
            ' adiante designado por "TRABALHADOR".' :
            ' adiante designada por "TRABALHADORA".'),
        ],
        alignment: 'justify',

      },
      {
        text: 'CLÁUSULA PRIMEIRA \n (Objecto e Funções):',
        style: 'h1',
      },
      {
        text: [
          'Pelo presente contrato, o EMPREGADOR contrata o TRABALHADOR para exercer as funções de ',
          employee?.role?.name + ' ',
          'na ',
          employee?.department?.name + ' ',
          ', na Província de ',
          address?.province + ', ',
          ' reservando-se a faculdade de o transferir para outro local de trabalho, sempre que para tal se mostrar necessário ao cabal desempenho da sua função ou por razões operacionais ou, ainda, de gestão de pessoal.',
        ],
      },
      {
        text: [
          'A', g ? 'o' : 'a', ' TRABALHADOR', g ? '' : 'A', ' é garantid', g ? 'o' : 'a', ' a ocupação efetiva do posto de trabalho de ',
          employee?.role?.name + ' ',
          'pertencente ao Qualificador Ocupacional e integrado no Grupo 4 da: Escala Salarial, cuja categoria ocupacional é a de ',
          employee?.role?.name + ' ',
        ]
      },

      {
        text: 'CLÁUSULA SEGUNDA\n(Início e Duração do Contrato)',
        style: 'h1',
      },
      {
        text: ['O contrato de trabalho é celebrado por um prazo de ',
          moment(employee?.contract?.endDate).diff(moment(employee?.contract?.startDate), 'month').toString(),
          ' meses, com início em ',
          moment(employee?.contract?.startDate).format('dd/MM/YYYY'),
          ' e término em ',
          moment(employee?.contract?.endDate).format('dd/MM/YYYY'),
          ', renovável automaticamente por iguais períodos de 3 (três) meses até ao limite máximo de 5 (cinco) anos.'],
      },
      {
        text: ' As partes poderão opor-se à renovação do contrato, mediante comunicação escrita enviada por correio eletrónico com indicação do domínio do EMPREGADOR, carta registada com aviso de recepção ou protocolo de recepção, com a antecedência mínima de 15 (quinze) dias úteis, face ao termo do prazo inicial ou das respectivas renovações.',
      },
      {
        text: 'CLÁUSULA TERCEIRA\n(Período Experimental)',
        style: 'h1',
      },
      {
        text: ['O presente contrato fica sujeito a um período experimental de 30 (trinta) dias, durante o qual qualquer uma das partes o pode fazer cessar, sem necessidade de aviso prévio, não conferindo, tal rescisão, direito a qualquer tipo de indemnização ou compensação.'],
      },

      {
        text: 'CLÁUSULA QUARTA\n(Horário de Trabalho)',
        style: 'h1',
      },
      {
        text: [
          g ? 'O' : 'A',
          ' TRABALHAD', g ? 'O' : 'A', 'R prestará as suas funções dentro do horário de quarenta e duas (42) horas semanais, distribuídas de segunda-feira a sexta-feira, dentro do período de 08h30 e término às 17h00, sem prejuízo de qualquer alteração de horário de trabalho, decorrente de necessidades objectivas de funcionamento dos serviços do EMPREGADOR e nos termos legais'],
      },


      {
        text: '3. REMUNERAÇÃO:',
        style: 'h1',
      },
      {
        text: 'O EMPREGADO receberá uma remuneração mensal bruta de [Valor da Remuneração], sujeita aos descontos legais e tributários aplicáveis.',
      },


      {
        text: '4. BENEFÍCIOS:',
        style: 'h1',
      },
      {
        text: 'O EMPREGADO terá direito a [Lista de Benefícios], de acordo com as políticas da EMPRESA, sujeitos a alterações conforme determinado pela EMPRESA.',
      },


      {
        text: '5. CONFIDENCIALIDADE E PROPRIEDADE INTELECTUAL:',
        style: 'h1',
      },
      {
        text: 'O EMPREGADO concorda em manter sigilo sobre informações confidenciais da EMPRESA e a respeitar os direitos de propriedade intelectual da EMPRESA, inclusive após o término do contrato.',
      },


      {
        text: '6. PRAZO DO CONTRATO:',
        style: 'h1',
      },
      {
        text: 'O presente contrato terá início em [Data de Início] e terá duração indefinida, podendo ser rescindido de acordo com as leis trabalhistas aplicáveis.',
      },


      {
        text: '7. AVISO PRÉVIO:',
        style: 'h1',
      },
      {
        text: 'Em caso de rescisão, ambas as partes concordam em cumprir um aviso prévio de [Prazo de Aviso Prévio] dias.',
      },

      {
        text: '8. DISPOSIÇÕES FINAIS:',
        style: 'h1',
      },
      {
        text: 'Este contrato substitui quaisquer acordos anteriores entre as partes e só pode ser modificado por escrito e assinado por ambas as partes.',
      },



      {
        text: [
          'Assinatura do Representante da Empresa\n\n',
          '___________________________\n\n',
          'Data: '

        ],
        style: 'footer',
      },



      {
        text: [
          'O Empregado\n\n',
          '___________________________\n\n',
          'Data: '
        ],
        style: 'footer',
      }
    ],
    footer: [
      {
        text: moment().format('YYYYMMDD'),

        alignment: 'center',
        style: 'lowFooter',

      },
    ]

    ,
    defaultStyle: {
      font: "Helvetica",
      lineHeight: 1.5,
      fontSize: 11,
      alignment: 'justify',
    },
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        marginTop: 35,
        marginBottom: 15,
        decoration: "underline"
      },
      h1: {
        fontSize: 14,
        bold: true,
        marginTop: 25,
        marginBottom: 5,
      },
      body: {
        fontSize: 12,
        bold: false,
        alignment: 'justify',
        marginLeft: 50,
        marginRight: 50,
        lineHeight: 2,
      },
      footer: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
      },
      lowFooter: {
        fontSize: 9,
      }
    },

  }

}

async function getPayStubDefinitions({ payStubId, data }: any): Promise<TDocumentDefinitions> {


  const payStub = await PayStub.scope('xfull').findOne({ where: { id: payStubId }, include: { all: true } })

  const { localCurrency: cur }: any = payStub;
  const banckAccount = await AccountPaymentData.findOne({ where: { employeeId: payStub?.contract?.employeeId }, include: { all: true } })

  const [company] = await Company.findAll();

  const [address]: Address[] = company?.address ?? [new Address];
  const logo = company?.logos?.includes('http')
    ? await toDataURL(company?.logos ?? '')
    : company?.logos

  const template = await [template_0, template_0][0]({ cur, payStubId, address, company, banckAccount, payStub, logo })

  return template;

}

const countervalue = (mycurrency: Currency, payStub: PayStub) => {

  let data = []
  if (mycurrency?.value !== 0) {
    return [
      ['Salario Líquido:', {
        text: currency(payStub?.netValue / mycurrency?.value ?? 0).split('AOA')[0],
        style: ['h2', { alignment: 'right', fontSize: 18 }],
      }],
      ['Contravalor[' + mycurrency?.code + ']:', {
        text: currency(payStub?.netValue ?? 0, { currency: payStub?.localCurrency?.code ?? 'AOA', tax: 1 }).split('AOA')[0],
        style: ['h2', { alignment: 'right', fontSize: 18 }],
      }]
    ]
  }

  return []


}
async function template_0({ cur, address, company, banckAccount, payStub, logo }: any): Promise<TDocumentDefinitions> {



  const month = moment().set('month', (payStub?.month - 1 ?? 0)).format('MMMM').toUpperCase();
  const defaultCurrency = cur;

  const myCurrency = payStub?.currency ?? defaultCurrency ?? { value: 1 };
  const parseValue = (value: number) => value / (myCurrency?.value ?? 1)


  const { body }: any = await DocumentTypeSetting.findOne()

  const html = htmlToPdfmake(textComposer(body, {}), { window: window });

  return {


    content: [
      // header
      ' ',
      {

        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return '#fefefe'//(rowIndex % 2 === 0) ? '#fafaff' : null;
          },
          hLineColor: function (i, node) {
            return '#fefefe'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#fefefe'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
          },
        },
        //layout: 'headerLineOnly', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [300, '*', 300],

          body: [
            [
              {
                image: logo ?? novaIcon,
                width: 100,

              },
              '',
              {
                text: [{ text: 'RECIBO DE SALARIO\n', style: 'h1' },

                  month,
                  ' DE ',
                payStub?.year
                ],
              }
            ],
            [
              {
                text: {
                  text: [
                    company?.name + '\n',
                    'NIF: ' + company?.nif + '\n',
                    address?.province + ' - ' + address?.country?.name,
                  ], fontSize: 9
                },
              },
              '',
              ''
            ],
            ['', '', '']

          ]
        }
      },
      ' ',
      ' ',
      {

        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return (rowIndex % 2 === 0) ? '#fefefe' : "#fdfdfd";
          },
          hLineColor: function (i, node) {
            return '#fdfdfd'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#fdfdfd'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
          },
        },
        style: {
          margin: [-10, 0, 0, -10]
        },
        //layout: 'headerLineOnly', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [95, '*', 95, '*'],
          body: [
            html,
            [
              { text: 'Nome:', style: 'd3' },
              { text: payStub?.contract?.employee?.person?.fullName, style: 'd2' },
              { text: 'Departamento:', style: 'd3' },
              { text: payStub?.contract?.department?.name, style: 'd2' }
            ],
            [
              { text: 'Numero:', style: 'd3' },
              { text: payStub?.contract?.employee?.code, style: 'd2' },
              { text: 'Função:', style: 'd3' },
              { text: payStub?.contract?.role?.name?.split('-')[0], style: 'd2' }
            ],
            [
              { text: 'Segurança Social:', style: 'd3' },
              { text: payStub?.contract?.employee?.person?.socialSecurityNumber, style: 'd2' },
              { text: 'Categoria:', style: 'd3' },
              { text: payStub?.contract?.category?.name, style: 'd2' }
            ],
            [
              { text: 'NIF:', style: 'd3' },
              { text: payStub?.contract?.employee?.idCard, style: 'd2' },
              { text: 'MOEDA:', style: 'd3' }, defaultCurrency?.name ?? 'Kwanza'],

          ]
        }
      },
      ' ',
      {

        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return null//(rowIndex % 2 === 0) ? '#fafaff' : null;
          },
          hLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
          },
        },
        //layout: 'headerLineOnly', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [10, '*', 100, 100],

          body: [
            [

              {
                text: '#',
                style: 'th',
              },
              {
                text: 'ABONO',
                style: 'th',
              },
              {
                text: 'QUANTIDADE',
                style: 'th',
              },
              {
                text: 'VALOR',
                style: 'th',
              }
            ], ...(payStub?.lines?.filter(({ debit }: any) => debit).sort((x: any, y: any) => String(x.code) === '1000' ? -1 : 1).map((line: any, k: number) => ([k + 1, line?.descriptions, 1,
            {
              text: currency(line?.value, { tax: cur?.value, currency: 'AOA' }).split('AOA')[0],
              style: 'textRight',
            }])) ?? []),

            [

              {
                border: [true, true, true, true],
                fillColor: '#FFF',
                text: '',

              },
              {
                fillColor: '#FFF',
                text: '',
              },
              {
                fillColor: '#FFF',
                text: 'Total',
                style: ['th', { alignment: 'right' }],
              },
              {
                text: currency(payStub?.grossValue ?? 0, { tax: cur?.value, currency: 'AOA' })?.split('AOA')[0],
                style: ['th', { alignment: 'right' }],
              }
            ]

          ]
        }
      }, ' ',
      {

        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return null//(rowIndex % 2 === 0) ? '#fafaff' : null;
          },
          hLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
          },
        },
        //layout: 'headerLineOnly', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [10, '*', 100, 100],

          body: [
            [

              {
                text: '#',
                style: 'th',
              },
              {
                text: 'DEDUÇÂO',
                style: 'th',
              },
              {
                text: 'QUANTIDADE',
                style: 'th',
              },
              {
                text: 'VALOR',
                style: 'th',
              }
            ], ...(payStub?.lines?.filter(({ debit }: any) => !debit).sort((x: any, y: any) => x.code > y.code ? -1 : 1).map((line: any, k: number) => ([k + 1, line?.descriptions, 1,
            {
              text: currency(line?.value, { tax: cur?.value, currency: 'AOA' }).split('AOA')[0],
              style: 'textRight',
            }])) ?? []),
            [

              {
                border: [true, true, true, true],
                fillColor: '#FFF',
                text: '',

              },
              {
                fillColor: '#FFF',
                text: '',
              },
              {
                fillColor: '#FFF',
                text: 'Total',
                style: ['th', { alignment: 'right' }],
              },
              {
                text: currency(payStub?.deductionValue ?? 0, { tax: cur?.value, currency: 'AOA' })?.split('AOA')[0],
                style: ['th', { alignment: 'right' }],
              }
            ]

          ]
        }
      },
      {
        columnGap: 50,
        columns: [

          {

            margin: [0, 0, 0, 0],
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 3,

              widths: [40, 150],

              body: [
                ['Banco:', banckAccount?.bank?.code ?? ''],
                ['Conta:', banckAccount?.number ?? ''],
                ['IBAN:', banckAccount?.iban ?? ''],

              ]
            }
          },

          {

            margin: [0, 0, 0, 0],
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 3,

              widths: ['*', '*'],

              body: [
                ['Resumo', ''],
                ['Salario Bruto:',
                  {
                    text: currency(payStub?.grossValue ?? 0, { tax: cur?.value, currency: 'AOA' }).split('AOA')[0],
                    style: ['h2', { alignment: 'right' }],
                  }],
                ['Deduções:',
                  {
                    text: currency(payStub?.deductionValue ?? 0, { tax: cur?.value, currency: 'AOA' }).split('AOA')[0],
                    style: ['h2', { alignment: 'right', }],
                  }],
                ['Salario Líquido:', {
                  text: currency(payStub?.netValue ?? 0, { tax: cur?.value, currency: 'AOA' }).split('AOA')[0],
                  style: ['h2', { alignment: 'right', fontSize: 12 }],
                }],
                [Number(myCurrency?.value) === 1 ? '' : 'Contravalor\n[1,00 KZ=' + currency(myCurrency?.value).split('AOA')[0] + myCurrency?.code + ']:', Number(myCurrency?.value) === 1 ? '' : {
                  text: currency(payStub?.netValue ?? 0).split('AOA')[0],
                  style: ['h2', { alignment: 'right' }],
                }],


              ]
            }
          }
        ],
      }
    ],
    footer: {
      columnGap: 50,
      columns: [
        ['\n\n\n\n'
        ],
        //  [{ image: writeRotatedText('I am rotated'), fit: [7, 53], alignment: 'center' }],
        {
          text: ['\n\n\n', 'Gerado com muito gosto por ', 'www.nova.ao'],
          style: ['lowFooter', { alignment: 'right', fontSize: 8 }]
        },
      ]
    }

    ,
    defaultStyle: {
      font: "Helvetica",
      lineHeight: 1.5,
      fontSize: 10,
      alignment: 'justify',
    },
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        marginTop: 35,
        marginBottom: 15,
        decoration: "underline",
      },
      d3: {
        alignment: 'right',
        color: '#333'
      },
      d2: {
        fontSize: 10,
      },
      headers: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
      },
      th: {
        bold: true,
        fontSize: 12,
        color: '#333',
        fillColor: '#fafaff',
        alignment: 'left',
      },
      tf: {
        bold: true,
        fontSize: 13,
        color: 'black',
        alignment: 'left',
        fillColor: '#fafaff'
      },
      h1: {
        fontSize: 14,
        bold: true,
        marginTop: 25,
        marginBottom: 5,
      },
      body: {
        fontSize: 12,
        bold: false,
        alignment: 'justify',
        marginLeft: 50,
        marginRight: 50,
        lineHeight: 2,
      },
      footer: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
      },
      lowFooter: {
        fontSize: 9,

        marginLeft: 50,
        marginRight: 50,
      },
      textRight: {

        alignment: 'right',
      }
    },

  }

}

export async function generateDocument({ employeeId, callBack, type, ...data }: any) {

  const printer = new PdfPrinter(fonts);

  const fn = [getDocDefinitions, getContractDefinitions][type - 1 ?? 1]
  const pdfDoc = printer.createPdfKitDocument(await fn({ employeeId, data }));

  const chunks: any[] | Uint8Array[] = []

  await pdfDoc.on("data", (chunk: any) => {
    chunks.push(chunk)
  })
  await pdfDoc.end();

  await pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks)
    callBack(`data:application/pdf;base64,${result.toString("base64")}`);
  })
}

export async function generatePayStub({ payStubId, callBack, type, ...data }: any) {

  const printer = new PdfPrinter(fonts);

  const pdfDoc = printer.createPdfKitDocument(await getPayStubDefinitions({ payStubId, data }), { tableLayouts: tableLayouts });

  const chunks: any[] | Uint8Array[] = []

  await pdfDoc.on("data", (chunk: any) => {
    chunks.push(chunk)
  })
  await pdfDoc.end();

  await pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks)
    callBack(`data:application/pdf;base64,${result.toString("base64")}`);
  })
}


const dictionary = [
  { value: 'employee.person.fullName', key: '[EMPLOYEE_FULLNAME]' },
  { value: 'employee.person.firstName', key: '[EMPLOYEE_FIRSTNAME]' },
  { value: 'employee.person.lastName', key: '[EMPLOYEE_LASTNAME]' },
  { value: 'Outros nomes do colaborador', key: '[EMPLOYEE_OTHERNAME]' },
  { value: 'employee.person.gender', key: '[EMPLOYEE_GENDER]' },
  { value: 'employee.person.age', key: '[EMPLOYEE_AGE]' },
  { value: 'employee.person.birthDate', key: '[EMPLOYEE_BIRTHDAY]' },
  { value: 'employee.person.nationality.nationality', key: '[EMPLOYEE_NATIONALITY]' },
  { value: 'employee.person.socialSecurity', key: '[EMPLOYEE_SOCIALSECURITY]' },
  { value: 'employee.code', key: '[EMPLOYEE_CODE]' },
  { value: 'employee.person.email', key: '[EMPLOYEE_EMAIL]' },
  { value: 'employee.person.phoneNumber', key: '[EMPLOYEE_PHONENUMBER]' },

  { value: 'employee.person.idcard', key: '[EMPLOYEE_IDCARD]' },
  { value: 'employee.person.address.details', key: '[EMPLOYEE_ADDRESS]' },
  { value: 'employee.person.birthPlace.details', key: '[EMPLOYEE_BIRTHPLACE]' },

  { value: 'employee.contract.role.name', key: '[EMPLOYEE_ROLE]' },
  { value: 'employee.contract.category.name', key: '[EMPLOYEE_CATEGORY]' },
  { value: 'employee.contract.department.name', key: '[EMPLOYEE_DEPARTMENT]' },
  { value: 'Tipo de contrato do colaborador', key: '[EMPLOYEE_CONTRACTTYPE]' },
  { value: 'Data de inicio de contrato do colaborador', key: '[EMPLOYEE_CONTRACSTARTDATE]' },
  { value: 'Data de fim de contrato do colaborador', key: '[EMPLOYEE_CONTRACENDDATE]' },
  { value: 'Data de registo do colaborador', key: '[EMPLOYEE_STARTDATE]' },

  { value: 'Salário base do colaborador', key: '[EMPLOYEE_BASEVALUE]' },
  { value: 'Salário líquido do colaborador', key: '[EMPLOYEE_NETVALUE]' },
  { value: 'Salário bruto do colaborador', key: '[EMPLOYEE_GROSSVALUE]' },
  { value: 'Outros Subsidios do colaborador', key: '[EMPLOYEE_ADITIONALPEYMENTS]' },

  { value: 'Nome da Empresa', key: '[COMPANY_NAME]' },
  { value: 'NIF da Empresa', key: '[COMPANY_NIF]' },
  { value: 'Slogam da Empresa', key: '[COMPANY_SLOGAM]' },
  { value: 'Descrição da Empresa', key: '[COMPANY_DESCRPTIONS]' },
  { value: 'Negócio da Empresa', key: '[COMPANY_BUSINESS]' },
  { value: 'Capital social da Empresa', key: '[COMPANY_SOCIALCAPITAL]' },

  { value: 'Email da Empresa', key: '[COMPANY_EMAIL]' },
  { value: 'Número de telefone da Empresa', key: '[COMPANY_PHONENUMBER]' },
  { value: 'Endereço da Empresa', key: '[COMPANY_PHONENUMBER]' },

  { value: 'Objectivo do documento', key: '[DOCUMENT_OBJECTIVE]' },
  { value: 'Entidade do documento', key: '[DOCUMENT_ENTITY]' },
  { value: 'Data actual', key: '[CURRENT_DATE]' },
  { value: 'Hora actual', key: '[CURRENT_TIME]' },
  { value: 'Data e hora actual', key: '[CURRENT_DATETIME]' },
]

const textComposer = (originalText: string, data: any) => {

  let text = originalText;

  const replacer = ({ key, value }: any) => {

    let v: any = data;
    const path = value.split('.')

    path.forEach((k: any) => {
      v = v ? v[k] : null
    });

    text = text.split(key).join(v??'----')
  }


  dictionary.forEach(replacer)

  return text;
}



