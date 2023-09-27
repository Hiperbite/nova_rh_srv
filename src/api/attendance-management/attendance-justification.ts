import { Request, Response } from "express";
import { AttendanceJustification } from "../../models/index";
import Api from "../Api";

class AttendanceJustificationApi extends Api<AttendanceJustification> {
  constructor() { super(AttendanceJustification) };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;

    const justification: AttendanceJustification | void = await this.repo.create(body, { include: { all: true } });

    return res.json(justification);
  };

  update = async (req: Request, res: Response): Promise<Response> => {

    return res.json();

  };

  find = async (req: Request, res: Response): Promise<Response> => {
    return res.json();
  }
}

export default new AttendanceJustificationApi();
export { AttendanceJustificationApi };
