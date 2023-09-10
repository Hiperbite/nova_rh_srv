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
import { Employee, PayStub } from '../../../models/index';

const documents: any = {
  IDCARD: "Bilhete",
  PASSPORT: "Passaporte"
}

const employeeType: any = {
  M: "funcionário",
  F: "funcionária"
}
async function getDocDefinitions({ employeeId, data }: any): Promise<TDocumentDefinitions> {

  const employee = await Employee.scope('all').findByPk(employeeId)

  const document: any = employee?.idCard || employee?.passport

  return {


    content: [
      {
        image: novaIcon,
        width: 100,
        marginTop: 35,

      },
      {
        text: 'Declaração de trabalho',
        style: 'header',
        alignment: 'center',

      },
      {
        text: [
          '\nPara os devidos efeitos julgados convenientes sobre ', { text: data.about, bold: true }, ' junto da ', { text: data.entity + ", ", bold: true }, ' declara', '-se que ', { text: employee?.person?.fullName + ",", bold: true }, ' de nacionalidade ', { text: employee?.person?.nationality + ", ", bold: true }, 'portadora do ', { text: documents[document?.type], bold: true }, ' com o número ', { text: document?.number, bold: true }, ' é Colaborador desta Empresa onde exerce a função de ', { text: employee?.role?.name, bold: true }, ' no ', { text: employee?.department?.name, bold: true }, ' auferindo o vencimento mensal de ', { text: 'Salário por extenso e numeral', bold: true }, '.\n\n',
          'Por ser verdade e me ter sido solicitado, mandei passar a presente declaração que vai por mim assinada e autenticada com carimbo a óleo em uso nesta Empresa\n\n',
          { text: 'A PRESENTE DECLARAÇÃO SERVE UNICAMENTE PARA A ENTIDADE ', bold: true },
          { text: data.entity.toUpperCase(), bold: true },
          '\n\nDirecção dos Recursos Humanos {nome da empresa}, em ',
          { text: moment().format('DD [de] MMMM [de] YYYY') }, '\n\n'
        ],
        style: 'body',
        bold: false
      },
      {
        text: [
          'O Diretor dos Recursos Humanos\n\n',
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
      font: "Helvetica"
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
        marginLeft: 35,
        marginRight: 35,
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

async function getContractDefinitions({ employeeId, data }: any): Promise<TDocumentDefinitions> {

  const employee = await Employee.scope('all').findByPk(employeeId)

  const document: any = employee?.idCard || employee?.passport

  return {


    content: [
      {
        text: 'CONTRATO DE TRABALHO',
        style: 'header',
        alignment: 'center',

      },
      {
        text: [
          'Entre [Nome da Empresa], com sede em [Endereço da Empresa], adiante denominada "EMPRESA", e',
          { text: employee?.person?.fullName + ",", bold: true }, ', portador do',
          { text: documents[document?.type], bold: true }, ' com o número ', { text: document?.number, bold: true },
          ', residente em ', { text: employee?.person?.livingAddress?.fullAddress, bold: true },
          ', adiante denominado "EMPREGADO", celebram o presente contrato de trabalho, de acordo com os termos e condições abaixo:'],
        alignment: 'justify',

      },
      {
        text: '1. CARGO E FUNÇÃO:',
        style: 'h1',
      },
      {
        text: 'O EMPREGADO será contratado para o cargo de [Cargo do Empregado], desempenhando funções relacionadas à Tecnologia da Informação (TI) e outras atividades correlatas conforme determinado pela EMPRESA.',
      },



      {
        text: '2. LOCAL E HORÁRIO DE TRABALHO:',
        style: 'h1',
      },
      {
        text: 'O local de trabalho do EMPREGADO será na sede da EMPRESA, ou em outros locais designados pela EMPRESA, de acordo com as necessidades do projeto. O horário de trabalho será [Horário de Trabalho], de [Dias de Trabalho] por semana.',
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

  
  const payStub = await PayStub.findOne({ where: { id: payStubId }, include: { all: true } })

  return {


    content: [
      {
        text: 'CONTRATO DE TRABALHO',
        style: 'header',
        alignment: 'center',

      },
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['*', 'auto', 100, '*'],

          body: [
            ['#', 'ABONO', 'QUANTIDADE', 'VALOR'],
            ['1', 'Salário Base', '22', '200.000,00'],
            ['2', 'SUbsidio de Ferias', '22', '32.500,00'],
            ['3', 'Subsidio de Trasnporte', '12','50.000,00'],
            
          ]
        }
      },
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['*', 'auto', 100, '*'],

          body: [
            ['#', 'ABONO', 'QUANTIDADE', 'VALOR'],
            ['1', 'Salário Base', '22', '200.000,00'],
            ['2', 'SUbsidio de Ferias', '22', '32.500,00'],
            ['3', 'Subsidio de Trasnporte', '12','50.000,00'],
            
          ]
        }
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

  const pdfDoc = printer.createPdfKitDocument(await getPayStubDefinitions({ payStubId, data }));

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




