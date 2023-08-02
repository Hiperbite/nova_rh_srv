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
import { Response } from 'express';

const docDefinition: TDocumentDefinitions = {
  defaultStyle: {
    font: "Helvetica"
  },
  content: [
    {
      text: 'Example',
      style: 'header',
      alignment: 'center',

    },
    {
      text: [
        'Para os devidos efeitos julgados convenientes na emissão de Passaporte de viagem junto dos Serviços de Migração e Estrangeiros, declara-se que a Sra. Rosa José Francisco Pacheco, de nacionalidade Angolana, portadora do Bilhete de Identidade com o N900051713KS039 é funcionária desta Empresa onde exerce a função de Auxiliar de Limpeza, auferindo o vencimento mensal de 39.730,00 Kz (Trinta e Nove Mil e Setecentos e Trinta Kwanzas).'
      ],
      style: 'body',
      bold: false
    },
    {
      text: [
        'Por ser verdade e me ter sido solicitado, mandei passar a presente declaração que vai por mim assinada e autenticada com carimbo a óleo  em uso nesta Empresa A PRESENTE DECLARAÇÃO SERVE UNICAMENTE PARA SER AOS SERVIÇOS DE MIGRAÇÃO E ESTRANGEIROS. Direcção dos Recursos Humanos do Grupo Santos e Mitoque, em Luanda, aos 10 de Janeiro de 2018.'
      ],
      style: 'body',
      bold: false,
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'center',
      marginTop: 4,
      marginBottom: 15,
      decoration: "underline"
    },
    body: {
      fontSize: 14,
      bold: false,
      alignment: 'justify',
      marginTop: 8,
      lineHeight: 2,
      leadingIndent: 24
    }
  }

}

export default async function generateDocument(res: Response, type?: any, data?: any) {

  const printer = new PdfPrinter(fonts);

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const chunks: any[] | Uint8Array[] = []

  await pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })

  let result;

  res.set('content-type', 'application/pdf');
  
  await pdfDoc.end();

  await pdfDoc.on("end", () => {
    result = Buffer.concat(chunks)

    res.end(result)
  })


}





