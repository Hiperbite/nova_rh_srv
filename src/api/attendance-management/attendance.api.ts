import { Request, Response } from "express";
import { Attendance, Employee, Procedure, SPs, } from "../../models/index";
import Api from "../Api";
import { Paginate } from "../../repository/repository";

class AttendanceApi extends Api<Attendance> {
  constructor() { super(Attendance) };

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
    const { id } = req.params;
    //const  {typeId, entryDate, kind, page, pageSize } = req.query;
    const attendance = await Attendance.scope("withPerson").findAll({ where: { typeId: id } });
    return res.json(attendance);

  }
}

export default new AttendanceApi();
export { AttendanceApi };
