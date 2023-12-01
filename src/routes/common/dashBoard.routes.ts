
import express from "express";
import api from "../../api/common/dashboards";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router()
  .get(
    "/common",
    // validateResource(createStudentSchema),
    asyncHandler(api.common)
  )
  
  .get(
    "/registered",
    // validateResource(createStudentSchema),
    asyncHandler(api.registered)
  )
  
  .get(
    "/get-student-honor-roll",
    // validateResource(createStudentSchema),
    asyncHandler(api.getStudentHonorRoll)
  )
  
  .get(
    "/get-student-count",
    // validateResource(createStudentSchema),
    asyncHandler(api.getStudentCount)
  )

  .get(
    "/callendar-date",
    asyncHandler(api.callendarDate)
  )

  .get("/get-employee-search", asyncHandler(api.getEmployeeSearch))

  .get(
    "/get-dashboard-data",
    // validateResource(createStudentSchema),
    asyncHandler(api.getDashboardData)
  )
  .get(
    "/get-attendance-data",
    asyncHandler(api.getAttendanceData)
  )

  .get(
    "/roles-employees-count",
    asyncHandler(api.rolesEmployeesCount)
  )

  .get(
    "/get-events",
    asyncHandler(api.getEvents)
  )
  ;

export default router;