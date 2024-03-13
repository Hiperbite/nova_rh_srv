
import { generateDocument, generatePayStub } from "../../application/common/docs-generate/document.app";
import { Request, Response } from "express";
import PayRollApp from "../../application/payrolls/pay_roll.app";
import PayRollExtract from "../../application/payrolls/pay_roll_extract";
import { Payroll, User } from "../../models/index";
var stream = require('stream');

export const getGeneratedDocument = async (req: Request, res: Response) =>
  (req.query.about)
    ? await generateDocument({ employeeId: req.params.id, callBack: (e: any) => res.send(e), ...req.query })
    : res.json();

export const getGeneratePayStub = async (req: Request, res: Response) =>
  await generatePayStub({ payStubId: req.params.id, callBack: (e: any) => res.end(e), ...req.query })

export const getGenerateWiTaxFile = async (req: Request, res: Response) => {
  const xml = await PayRollApp.generateWiTaxReportXML(2023, 10)


  const blob = new Blob([xml], { type: 'application/xml' });
  const arrayBuffer = await blob.arrayBuffer();
  var fileContents = Buffer.from(arrayBuffer);

  const fileContent = "data:" + blob.type + ';base64,' + fileContents.toString('base64');
  res.send({ fileContent, fileName: 'wix.xml' });
}


export const getGenerateSocialSecurityMapFile = async (req: any, res: Response) => {
  const { id } = req?.params
  //const { user } = req?.locals.user;

  const user = await User.findOne();
  const [file, type, fileName] = await PayRollApp.generateSocialSecurityMapReportXML(id, 0, user)


  const blob = new Blob([file], { type });
  const arrayBuffer = await blob.arrayBuffer();
  var fileContents = Buffer.from(arrayBuffer);

  const fileContent = "data:" + blob.type + ';base64,' + fileContents.toString('base64');
  res.send({ fileContent, fileName });
}

export const getGeneratePayRollExtractFile = async (req: Request, res: Response) => {

  const { id: uid } = req.params;
  const [id, type] = uid.split('.')
  const payroll = await Payroll.findByPk(id);
  if (payroll === null) throw new Error();
  let { blob, fileName, contentType }: any = await PayRollExtract.generate(String(req.query['type'] ?? 'ps2'), payroll)

  const arrayBuffer = await blob.arrayBuffer();
  var fileContents = Buffer.from(arrayBuffer);

  const fileContent = "data:" + blob.type + ';base64,' + fileContents.toString('base64');
  res.send({ fileContent, fileName: fileName.toLowerCase() });
  return;
}


