
import { Attendance } from "../../models/index";
import { Op } from "sequelize";
import moment from 'moment';

export class AttendanceApp {

  static filter = (filter: any) => {
    const { code, date, in_year, employeeId, typeId } = filter

    let where: any = {}
    const include: any = Attendance?.options;
    const myInclude = include.scopes.default.include

    if (code)
      where.code = code;

    if (date)
      where[Op.and] = [{
        createdAt: {
          [Op.gte]: date + ' 00:00:00'
        }
      }, {
        createdAt: {
          [Op.lte]: date + ' 23:59:59'
        }
      }];
    if (employeeId) {
      where.employeeId = employeeId
    }

    if (typeId) {
      where.typeId = typeId
    }
    if (in_year) {
      const start = moment().year(in_year).startOf('year').toDate();
      const end = moment().year(in_year).endOf('year').toDate();
      where[Op.or] = [{
        startDate: {
          [Op.between]: [start, end]
        }
      }, {
        endDate: {
          [Op.between]: [start, end]
        }
      }];
    }
    myInclude?.forEach((m: any) => {

      delete m.where

    })

    return {
      where,
      scope: 'default',
      include: myInclude
    }
  }

}
