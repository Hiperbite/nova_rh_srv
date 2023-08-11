
import { Request, Response } from "express";
import generateDocument from "../../application/common/docs-generate/document.app";


export async function getGeneratedDocument(req: Request, res: Response) {

  if (req.query.about)
    return await generateDocument(req, res)

  return res.json()
}
