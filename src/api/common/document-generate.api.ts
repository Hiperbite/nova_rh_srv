
import { generateDocument, generatePayStub } from "../../application/common/docs-generate/document.app";
import { Request, Response } from "express";
import PayRollApp from "../../application/payrolls/pay_roll.app";


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


