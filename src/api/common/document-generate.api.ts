
import { Request, Response } from "express";
import generateDocument  from "../../application/common/docs-generate/document.app";


export async function getGeneratedDocument(req: Request, res: Response) {

  await generateDocument(req, res)

}
