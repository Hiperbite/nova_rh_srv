import express from "express";
import Api from "../../api/Api";
import validateResource from "../../application/middleware/validateResource";
import { justificationCreateSchema, justificationUpdateSchema } from "../../application/schema/attendance/attendance.justification.schema";
import { AttendanceJustification } from "./../../models/index";
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const api = new Api(AttendanceJustification)
// asyncHandler(
const router = express
  .Router()

router.post(
  "/",
  validateResource(justificationCreateSchema),
  asyncHandler(api.create)
)

  .put(
    "/:id",
    validateResource(justificationUpdateSchema),
    asyncHandler(api.update)
  )

  .get(
    "/:id",
    asyncHandler(api.find)
  )

  .delete(
    "/:id",
    asyncHandler(api.delete)
  )

  .get(
    "/",
    asyncHandler(api.findBy)
  );

export default router;
