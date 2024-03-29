import { Request, Response } from "express";
import { AttendanceType } from "../../models/index";
import Api from "../Api";

class AttendanceTypeApi extends Api<AttendanceType> {
  constructor() { super(AttendanceType) };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;

    const justification: AttendanceType | void = await this.repo.create(body, { include: { all: true } });

    return res.json(justification);
  };

}

export default new AttendanceTypeApi();
export { AttendanceTypeApi };
