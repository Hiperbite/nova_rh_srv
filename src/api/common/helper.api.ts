
import { Request, Response } from "express";

import IRepository from "../../repository/iRepository";
import { Paginate } from "../../repository/repository";
import PdfService from '../../service/pdf.service';
import { EventType } from '../../models/index';

import { canCreateEnrollment } from '../../application/business';

const fs = require('fs');

class HelperApi {
  constructor() { };

  fileDownload = async (req: Request, res: Response): Promise<Response> => {

    
    const directoryPath = await (new PdfService()).generate({});

    res.download(directoryPath, (err: any) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
      fs.unlinkSync(directoryPath)
    })
    return res;
  };

  permissions = async (req: Request, res: Response): Promise<Response> => {

    let can: any = {}

    const { permissions }: any = req.query?.where
    for (let p in permissions)
      switch (permissions[p]) {
        case 'canCreateEnrollment':
          can.canCreateEnrollment = await canCreateEnrollment(EventType.Matricula);
          break;
        case 'canCreateStudent':
          can.canCreateStudent = await canCreateEnrollment(EventType.Inscricao);
          break;
        case 'canReCreateEnrollment':
          can.canReCreateEnrollment = await canCreateEnrollment(EventType.ConfirmacaoMatricula);
          break;
      }



    res.send(can);
    return res;
  }
}

export default new HelperApi();
export { HelperApi };