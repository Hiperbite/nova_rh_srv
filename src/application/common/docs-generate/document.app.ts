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
        'This paragraph uses header style and overrides bold value setting it back to false.\n',
        'Header style in this example sets alignment to justify, so this paragraph should be rendered \n',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.'
      ],
      style: 'body',
      bold: false
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'center',
      marginTop: 4,
      marginBottom: 8,
      decoration: "underline"
    },
    body: {
      fontSize: 18,
      bold: false,
      alignment: 'justify',
      marginTop: 8,
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

  await pdfDoc.end();

  await pdfDoc.on("end", () => {
     result = Buffer.concat(chunks)

     res.end(result)
  })

 
}





