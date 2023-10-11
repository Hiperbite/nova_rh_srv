import { Request, Response } from "express";
import { Procedure, SPs, Track, } from "../../models/index";
import { DefaultRepository as Repository } from "../../repository/index";
import IRepository from "../../repository/iRepository";

class DashBoardApi {
  constructor(private repo: IRepository<any>) { };

  common = async (req: Request, res: Response): Promise<Response> => {
    const studentsCount = {
      age: await Procedure(SPs.GetStudentsCountAge)
      , gender: await Procedure(SPs.GetStudentsCountGender)
      , maritalStatus: await Procedure(SPs.GetStudentsCountMaritalStatus)
      , nationality: await Procedure(SPs.GetStudentsCountNationality)
      , older: await Procedure(SPs.GetStudentsCountOlder)
    };

    return res.json({ studentsCount });
  };
  registered = async (req: Request, res: Response): Promise<Response> => {
    const registered = {
      students: await Procedure(SPs.GetStudentsRegistered)

    };

    return res.json({ registered });
  };
  getStudentHonorRoll = async (req: Request, res: Response): Promise<Response> => {
    const studentHonorRoll = {
      students: await Procedure(SPs.GetStudentHonorRoll)
    };

    return res.json({ studentHonorRoll });
  };
  getDashboardData = async (req: Request, res: Response): Promise<Response> => {
    const dashboardData = await Procedure(SPs.GetDashboardData);
    
    return res.json(dashboardData);
  };
  getAttendanceData = async (req: Request, res: Response): Promise<Response> => {
    
    const  {typeId, entryDate, kind, page, pageSize} : any = req.query;

    const attendanceData : any = await Procedure(SPs.GetAttendaceData, [typeId,entryDate,kind,page, pageSize]);

    const total = attendanceData?.length === 0 ? 0 : attendanceData[0]?.total;
    const divider = !pageSize ? 1 : +(pageSize) ;
    
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

  getStudentCount = async (req: Request, res: Response): Promise<Response> => {
    const studentsCount =(await Procedure(SPs.GetStudentCount))[0]
    
    return res.json({ studentsCount });
  };
  callendarDate = async (req: Request, res: Response): Promise<Response> => {
    const {start, end} = req.query;

    const calendarDates = await Procedure(SPs.GetCalendarDate, [start,end]);
    
    return res.json(calendarDates);
  }
  getEmployeeSearch = async(req: Request, res: Response): Promise<Response> => {
    const {name} = req.query;
    const searchEmployee = await Procedure(SPs.GetEmployeeSearch, [name]);

    return res.json(searchEmployee);
  }
  rolesEmployeesCount = async (req: Request, res: Response): Promise<Response> => {
    
    const rolesEmployeesCount = await Procedure(SPs.GetRolesEmployeesCount);
    
    return res.json(rolesEmployeesCount);
  }
}

export default new DashBoardApi(new Repository(Track));
export { DashBoardApi };
