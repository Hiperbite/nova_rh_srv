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
import { Request, Response } from 'express';
import { Employee } from '../../../models/index';

async function getDocDefinitions(data: any) {

  const employee = await Employee.scope('default').findByPk(data.id)

  const document: any = employee?.idCard || employee?.passport

  let definiton: TDocumentDefinitions = {

    defaultStyle: {
      font: "Helvetica"
    },
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
          '\nPara os devidos efeitos julgados convenientes na', { text: 'tipo de solicitacao', bold: true }, 'junto da', { text: 'entidade que solicita, ', bold: true }, 'declara-se que', { text: employee?.person?.fullName + ",", bold: true }, 'de nacionalidade', { text: employee?.person?.nationality + ", ", bold: true }, 'portadora do ', { text: document?.type, bold: true }, ' com o ', { text:  document?.number, bold: true }, ' é {funcionária(logica a aplicar)} desta Empresa onde exerce a função de ', { text: 'Funcao do funcionario', bold: true }, ' auferindo o vencimento mensal de ', { text: 'Salrio por extenso e numeral', bold: true }, '.\n\n',
          'Por ser verdade e me ter sido solicitado, mandei passar a presente declaração que vai por mim assinada e autenticada com carimbo a óleo em uso nesta Empresa\n\n',
          { text: 'A PRESENTE DECLARAÇÃO SERVE UNICAMENTE PARA A {ENTIDADE}.', bold: true },
          '\n\nDirecção dos Recursos Humanos {nome da empresa}, em {Luanda, aos 10 de Janeiro de 2018}.\n\n'
        ],
        style: 'body',
        bold: false
      },
      {
        text: [
          'O Diretor dos Recursos Humanos\n\n',
          '-------------------------------------------------------\n\n',
          '{Nome do diretor}'
        ],
        style: 'footer',
      }
    ],
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
      }
    }

  }

  return definiton
}

export default async function generateDocument(req: Request, res: Response, type?: any, data?: any) {

  const printer = new PdfPrinter(fonts);

  const pdfDoc = printer.createPdfKitDocument(await getDocDefinitions({ data: req.body.data, id: req.params.id }));

  const chunks: any[] | Uint8Array[] = []


  await pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })

  let result;

  await pdfDoc.end();

  await pdfDoc.on("end", () => {
    result = Buffer.concat(chunks)

    res.end(result)
  })


}





