import Api from "../../api/Api";
import express from "express";
import { Attendance } from "./../../models/index";
import { AttendanceApi } from "../../api/attendance-management/attendance.api";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
  const api = new Api(Attendance);
// asyncHandler(
  const attendanceApi = new AttendanceApi();

const router = express
  .Router()

  router.post(
    "/",
    asyncHandler(api.create)
  )
  router.put(
    "/:id",
    asyncHandler(api.update)
  );
  router.get(
    "/:id",
    asyncHandler(api.find)
  );
  router.get(
    "/type",
    asyncHandler(attendanceApi.findByCode)
  );
  router.get(
    "/",
    asyncHandler(api.findBy)
  );

export default router;
