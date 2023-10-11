import { Request, Response } from "express";
import { Attendance, Procedure, SPs, } from "../../models/index";
import Api from "../Api";
import { Paginate } from "../../repository/repository";

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

    const { typeId, entryDate, kind, page, pageSize }: any = req.query;

    const attendanceData: any = await Procedure(SPs.GetAttendaceData, [typeId, entryDate, kind, page, pageSize]);

    const total = attendanceData?.length === 0 ? 0 : attendanceData[0]?.total;
    const divider = !pageSize ? 1 : +(pageSize);

    const data = {
      data: attendanceData,
      page: +(page),
      pageSize: +(pageSize),
      total,
      pages: !(total > pageSize) ? 1 : (total / divider),
      message: []
    }
    
    return res.json(data);

  }
}

export default new AttendanceApi();
export { AttendanceApi };
