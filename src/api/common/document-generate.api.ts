
import { Request, Response } from "express";
import generateDocument from "../../application/common/docs-generate/document.app";


export const getGeneratedDocument = async (req: Request, res: Response) =>
  (req.query.about) &&
  await generateDocument({ employeeId: req.params.id, callBack: (e: any) => res.send(e), ...req.query })


