import express from "express";
import api from "../../api/attendance-management/attendance-type.api";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express
  .Router()

  .post(
    "/",
  /*   validateResource(createSessionSchema), */
    asyncHandler(api.create)
  )

export default router;
