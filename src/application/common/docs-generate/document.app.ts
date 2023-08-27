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
import { Employee } from '../../../models/index';

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

export default async function generateDocument({ employeeId, callBack, ...data }: any) {

  const printer = new PdfPrinter(fonts);

  const pdfDoc = printer.createPdfKitDocument(await getDocDefinitions({ employeeId, data }));

  const chunks: any[] | Uint8Array[] = []

  await pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })
  await pdfDoc.end();

  await pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks)
    callBack(`data:application/pdf;base64,${result.toString("base64")}`);
  })
}





