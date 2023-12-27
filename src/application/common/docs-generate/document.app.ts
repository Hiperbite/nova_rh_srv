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

import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AccountPaymentData, Address, Company, Contact, Employee, PayStub } from '../../../models/index';
import { toDataURL } from '../../../routes/hendlers';


//let USDollar =
const currency = (value: number = 0) => (new Intl.NumberFormat('pt-PT',
  { style: 'currency', currency: 'AOA' },
)).format(value);

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

  const logo = company?.logos?.includes('http')
    ? await toDataURL(company?.logos ?? '')
    : company?.logos
  return {

    pageMargins: [80, 60, 80, 60],
    content: [
      {
        columnGap: 10,
        columns: [
          [{
            image: logo ?? novaIcon,
            width: 100,
          },
          company?.name + '\n' +
          'NIF: ' + company?.nif + '\n'
          ],
          ''
        ],

      },
      {
        text: 'Declaração de trabalho',
        style: 'header',
        alignment: 'center',
      },
      {
        text: [
          '\nPara os devidos efeitos julgados convenientes sobre ', { text: data.about, bold: true }, ' junto da ', { text: data.entity + ", ", bold: true }, ' declara', '-se que ', { text: employee?.person?.fullName + ",", bold: true }, ' de nacionalidade ', { text: employee?.person?.nationality?.nationality + ", ", bold: true }, 'portadora do ', { text: documents[document?.type], bold: true }, ' com o número ', { text: document?.number, bold: true }, ', é Colaborador desta Empresa onde exerce a função de ', { text: employee?.role?.name, bold: true }, ' no/a ', { text: employee?.department?.name, bold: true }, ' auferindo o vencimento base mensal de ', { text: currency(employee?.contract?.salaryPackage?.baseValue), bold: true }, '.\n\n',
          'Por ser verdade e me ter sido solicitado, mandei passar a presente declaração que vai por mim assinada e autenticada com carimbo a óleo em uso nesta Empresa\n\n',
          { text: 'A PRESENTE DECLARAÇÃO SERVE UNICAMENTE PARA A ENTIDADE ', bold: true },
          { text: data.entity.toUpperCase(), bold: true },
          '\n\n\nDirecção dos Recursos Humanos ' + company?.name + ', em ',
          { text: moment().format('DD [de] MMMM [de] YYYY') }, '\n\n'
        ],
        style: 'body',
        bold: false
      },
      {
        text: [
          '\n\n\nO Diretor dos Recursos Humanos\n\n',
          '___________________________\n\n',

        ],
        style: 'footer',
      }
    ],
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


  const payStub = await PayStub.scope('full').findOne({ where: { id: payStubId }, include: { all: true } })

  const banckAccount = await AccountPaymentData.findOne({ where: { employeeId: payStub?.contract?.employeeId }, include: { all: true } })

  const [company] = await Company.findAll();

  const [address]: Address[] = company?.address ?? [new Address];
  const logo = company?.logos?.includes('http')
    ? await toDataURL(company?.logos ?? '')
    : company?.logos

  const template = await [template_0, template_1][0]({ payStubId, address, company, banckAccount, payStub, logo })

  return template;
  
}
async function template_1({  address, company, banckAccount, payStub, logo }: any): Promise<TDocumentDefinitions> {


  return {


    content: [
      // header
      ' ',
      {

        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return '#FFF'//(rowIndex % 2 === 0) ? '#fafaff' : null;
          },
          hLineColor: function (i, node) {
            return '#FFF'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#FFF'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
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

                moment().set('month', (payStub?.month ?? 0) - 1).format('MMMM').toUpperCase,
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
            return (rowIndex % 2 === 0) ? '#fafaff' : "#fafaff";
          },
          hLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
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
              { text: payStub?.contract?.role?.name?.includes('-') ? payStub?.contract?.role?.name?.split('-')[1] : '...', style: 'd2' }
            ],
            [
              { text: 'NIF:', style: 'd3' },
              { text: payStub?.contract?.employee?.idCard, style: 'd2' },
              { text: 'Nivel:', style: 'd3' }, ''],

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
            ], ...(payStub?.lines?.filter(({ debit }: any) => debit).map((line: any, k: number) => ([k + 1, line?.descriptions, '',
            {
              text: currency(line?.value).split('AOA')[0],
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
                text: 'Valor Bruto',
                style: ['th', { alignment: 'right' }],
              },
              {
                text: currency(payStub?.grossValue ?? 0)?.split('AOA')[0],
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
            ], ...(payStub?.lines?.filter(({ debit }: any) => !debit).map((line: any, k: number) => ([k + 1, line?.descriptions, 0,
            {
              text: currency(line?.value).split('AOA')[0],
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
                text: currency(payStub?.deductionValue ?? 0)?.split('AOA')[0],
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
                    text: currency(payStub?.grossValue ?? 0).split('AOA')[0],
                    style: ['h2', { alignment: 'right' }],
                  }],
                ['Deduções:',
                  {
                    text: currency(payStub?.deductionValue ?? 0).split('AOA')[0],
                    style: ['h2', { alignment: 'right', }],
                  }],
                ['Salario Líquido:', {
                  text: currency(payStub?.netValue ?? 0).split('AOA')[0],
                  style: ['h2', { alignment: 'right', fontSize: 18 }],
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
        [
          {
            text: company?.name + '',
            style: ['lowFooter', 'd2', { margin: [0, 0, 0, 10] }],
          }, {
            text:
              company?.contacts?.map(({ descriptions }: any) => descriptions ?? '').join(' | ') + '\n'
              + address?.fullAddress,
            style: ['lowFooter', { margin: [0, 0, 0, 10] }],
          },]
        , {
          text: '\n\nwww.nova.ao',
          style: ['lowFooter', { alignment: 'right' }]
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
        bold: true,
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

async function template_0({  address, company, banckAccount, payStub , logo}: any): Promise<TDocumentDefinitions> {


  return {


    content: [
      // header
      ' ',
      {

        layout: {
          fillColor: function (rowIndex: number, node: any, columnIndex: number) {
            return '#FFF'//(rowIndex % 2 === 0) ? '#fafaff' : null;
          },
          hLineColor: function (i, node) {
            return '#FFF'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#FFF'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
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

                moment().set('month', (payStub?.month ?? 0) - 1).format('MMMM').toUpperCase,
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
            return (rowIndex % 2 === 0) ? '#fafaff' : "#fafaff";
          },
          hLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.body?.length) ? '#AAA' : 'blue';
          },
          vLineColor: function (i, node) {
            return '#eeeeff'//(i === 0 || i === node?.table?.widths?.length) ? 'red' : 'blue';
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
              { text: payStub?.contract?.role?.name?.includes('-') ? payStub?.contract?.role?.name?.split('-')[1] : '...', style: 'd2' }
            ],
            [
              { text: 'NIF:', style: 'd3' },
              { text: payStub?.contract?.employee?.idCard, style: 'd2' },
              { text: 'Nivel:', style: 'd3' }, ''],

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
            ], ...(payStub?.lines?.filter(({ debit }: any) => debit).map((line: any, k: number) => ([k + 1, line?.descriptions, '',
            {
              text: currency(line?.value).split('AOA')[0],
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
                text: 'Valor Bruto',
                style: ['th', { alignment: 'right' }],
              },
              {
                text: currency(payStub?.grossValue ?? 0)?.split('AOA')[0],
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
            ], ...(payStub?.lines?.filter(({ debit }: any) => !debit).map((line: any, k: number) => ([k + 1, line?.descriptions, 0,
            {
              text: currency(line?.value).split('AOA')[0],
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
                text: currency(payStub?.deductionValue ?? 0)?.split('AOA')[0],
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
                    text: currency(payStub?.grossValue ?? 0).split('AOA')[0],
                    style: ['h2', { alignment: 'right' }],
                  }],
                ['Deduções:',
                  {
                    text: currency(payStub?.deductionValue ?? 0).split('AOA')[0],
                    style: ['h2', { alignment: 'right', }],
                  }],
                ['Salario Líquido:', {
                  text: currency(payStub?.netValue ?? 0).split('AOA')[0],
                  style: ['h2', { alignment: 'right', fontSize: 18 }],
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
        [
          {
            text: company?.name + '',
            style: ['lowFooter', 'd2', { margin: [0, 0, 0, 10] }],
          }, {
            text:
              company?.contacts?.map(({ descriptions }: any) => descriptions ?? '').join(' | ') + '\n'
              + address?.fullAddress,
            style: ['lowFooter', { margin: [0, 0, 0, 10] }],
          },]
        , {
          text: '\n\nwww.nova.ao',
          style: ['lowFooter', { alignment: 'right' }]
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
        bold: true,
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




