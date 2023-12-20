import { Request, Response } from "express";
import { Attendance, AttendanceType, Employee, Procedure, SPs } from "../../models/index";
import Api from "../Api";
import Repository, { Paginate } from "../../repository/repository";
import {
  Model as M,
} from "sequelize-typescript";
import { Op } from "sequelize";
import moment from "moment";

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

    const attendance = await Attendance.create(body);

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

  lastVaccation = async (req: Request, res: Response): Promise<Response> => {


    const type = await AttendanceType.findOne({
      where: {
        code: 'VACATION' 
      }
    });

    const lastVaccation = await Attendance.scope("full").findAll({
      where: {
        employeeId: req.query?.employeeId,
        typeId: type?.id,
        startDate: {
          [Op.lte]: Date.now(), 
        },
        endDate: {
          [Op.gte]: Date.now(), 
        }
      }, order:
        [['endDate', 'DESC']],
        limit: 1
    })

    return res.json(lastVaccation);

  }

  NextVaccations = async (req: Request, res: Response): Promise<Response> => {

    const type = await AttendanceType.findOne({
      where: {
        code: 'VACATION' 
      }
    });

    const nextVaccations = await Attendance.scope("full").findAll({
      where: {
        employeeId: req.query?.employeeId,
        typeId: type?.id,
        startDate: {
          [Op.gt]: Date.now(), 
        }
      }, order:
        [['endDate', 'DESC']]
    })

    return res.json(nextVaccations);

  }



}

export default new AttendanceApi();
export { AttendanceApi };
