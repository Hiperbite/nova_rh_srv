import { Request, Response } from "express";
import { Attendance, Employee, Procedure, SPs } from "../../models/index";
import Api from "../Api";
import Repository, { Paginate } from "../../repository/repository";
import {
  Model as M,
} from "sequelize-typescript";

class AttendanceApi extends Api<Attendance> {
  constructor() { 
    super(Attendance) 
    this.repo = new Repository<M>(Attendance);
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    let { body } = req;

    let employee: any = await Employee.findOne({
      where: {
        code: body?.employeeCode
      }
    })

    if (employee)
      body = { ...body, ...employee.id }

    const attendance: Attendance | void = await this.repo.create(body, { include: { all: true } });

    return res.json(attendance);
  };

  update = async (req: Request, res: Response): Promise<Response> => {

    return res.json();

  };

    findByCode = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;

    const attendance = await Attendance.scope("withPerson").findAll({where: {typeId: id}});
    
    return res.json(attendance);

  }

  weekPresence = async (req: Request, res: Response): Promise<Response> => {

    
    const totalPresence = await Procedure(SPs.GetTotalWeekPresence, [req.body.startDate, req.body.endDate]);

    return res.json(totalPresence);

  }
}

export default new AttendanceApi();
export { AttendanceApi };
