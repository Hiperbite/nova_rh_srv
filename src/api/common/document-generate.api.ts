
import { generateDocument, generatePayStub } from "../../application/common/docs-generate/document.app";
import { Request, Response } from "express";
import PayRollApp from "../../application/payrolls/pay_roll.app";
import PayRollExtract from "../../application/payrolls/pay_roll_extract";
import { Payroll } from "../../models/index";
var stream = require('stream');

export const getGeneratedDocument = async (req: Request, res: Response) =>
  (req.query.about)
    ? await generateDocument({ employeeId: req.params.id, callBack: (e: any) => res.send(e), ...req.query })
    : res.json();

export const getGeneratePayStub = async (req: Request, res: Response) =>
  await generatePayStub({ payStubId: req.params.id, callBack: (e: any) => res.end(e), ...req.query })

export const getGenerateWiTaxFile = async (req: Request, res: Response) => {
  const xml = await PayRollApp.generateWiTaxReportXML(2023, 10)
  res.header("Content-Type", "application/xml");
  return res.send(xml);
}
export const getGeneratePayRollExtractFile = async (req: Request, res: Response) => {

  const { id } = req.params;
  const payroll = await Payroll.findByPk(id);
  if (payroll === null) throw new Error();
  let { blob, fileName }: any = await PayRollExtract.generate(String(req.query['type'] ?? 'ps2'), payroll)


  const arrayBuffer = await blob.arrayBuffer();
  var fileContents = Buffer.from(arrayBuffer);

  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  res.set('Content-disposition', 'attachment; filename=' + fileName);
  res.set('Content-Type', 'text/plain');

  readStream.pipe(res);
}


