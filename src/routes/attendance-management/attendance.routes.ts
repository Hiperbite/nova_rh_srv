import Api from "../../api/Api";
import express from "express";
import { Attendance } from "./../../models/index";
import { AttendanceApi } from "../../api/attendance-management/attendance.api";
import validateResource from "../../application/middleware/validateResource";
import { attendanceCreateSchema } from "../../application/schema/attendance/attendance.schema";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const api = new Api(Attendance);
// asyncHandler(
const attendanceApi = new AttendanceApi();

const router = express
  .Router()

router.post(
  "/",
  validateResource(attendanceCreateSchema),
  asyncHandler(api.create)

)
router.put(
  "/:id",
  asyncHandler(api.update)
);

router.delete(
  "/:id",
  asyncHandler(api.delete)
);

router.get(
  "/week-presences",
  asyncHandler(attendanceApi.weekPresence)
);

router.get(
  "/vaccations/last",
  asyncHandler(attendanceApi.lastVaccation)
);

router.get(
  "/vaccations/next",
  asyncHandler(attendanceApi.NextVaccations)
);

router.get(
  "/:id",
  asyncHandler(api.find)
);

router.get(
  "/type/:id",
  asyncHandler(attendanceApi.findByCode)
);

router.get(
  "/",
  asyncHandler(api.findBy)
);
export default router;
