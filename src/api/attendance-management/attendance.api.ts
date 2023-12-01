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
    const { id } = req.params;

    const attendance = await Attendance.scope("withPerson").findAll({ where: { typeId: id } });

    return res.json(attendance);

  }

  weekPresence = async (req: Request, res: Response): Promise<Response> => {

    const { startDate, endDate } = req.query;

    const totalPresences: any = await Procedure(SPs.GetTotalWeekPresence, [startDate, endDate]);

    const totalFaults: any = await Procedure(SPs.GetWeekPresence, [startDate, endDate]);

    const totalEmployees: any = await Employee.count({
      where: {
        isActive: true
      }
    });

    let presences = {
      monday: totalPresences[0]?.mondayCount - totalFaults[0]?.mondayCount,
      tuesday: totalPresences[0]?.tuesdayCount - totalFaults[0]?.tuesdayCount,
      wednesday: totalPresences[0]?.wednesdayCount - totalFaults[0]?.wednesdayCount,
      thursday: totalPresences[0]?.thursdayCount - totalFaults[0]?.thursdayCount,
      friday: totalPresences[0]?.fridayCount - totalFaults[0]?.fridayCount,
      saturday: totalPresences[0]?.saturdayCount - totalFaults[0]?.saturdayCount,
      sunday: totalPresences[0]?.sundayCount - totalFaults[0]?.sundayCount
    }

    return res.json({ presences, totalPresences: totalPresences[0], totalFaults: totalFaults[0], totalEmployees });

  }
}

export default new AttendanceApi();
export { AttendanceApi };
