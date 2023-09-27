import { Request, Response } from "express";
import { Attendance } from "../../models/index";
import Api from "../Api";

class AttendanceApi extends Api<Attendance> {
  constructor() { super(Attendance) };

  create = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;

    const attendance: Attendance | void = await this.repo.create(body, { include: { all: true } });

    return res.json(attendance);
  };

  update = async (req: Request, res: Response): Promise<Response> => {

    return res.json();

  };

  find = async (req: Request, res: Response): Promise<Response> => {
    return res.json();
  }
}

export default new AttendanceApi();
export { AttendanceApi };
