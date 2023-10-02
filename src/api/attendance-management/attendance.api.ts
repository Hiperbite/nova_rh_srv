import { Request, Response } from "express";
import { Attendance } from "../../models/index";
import Api from "../Api";
import { Paginate } from "repository/repository";

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

  findByCode = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const { query: opts } = req;

    const models: Paginate<Attendance> | undefined =
      await this.repo
        .paginate(
          {
            where: {
              typeId: id
            }
          },
          {

            include: { all: true },
            ...opts,
          });

    return res.json(models);
    
  }
}

export default new AttendanceApi();
export { AttendanceApi };
