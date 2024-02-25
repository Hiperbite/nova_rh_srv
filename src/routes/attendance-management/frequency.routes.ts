import Api from "../../api/Api";
import express from "express";
import { Frequency } from "../../models/index";
import validateResource from "../../application/middleware/validateResource";
import { frequencyCreateSchema } from "../../application/schema/attendance/attendance.schema";
import { FrequencyApi } from "../../api/Attendance/frequency.api";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const api = new FrequencyApi();

const router = express
  .Router()

  router.post(
    "/",
    validateResource(frequencyCreateSchema),
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
  "/:id",
  asyncHandler(api.find)
);

router.get(
  "/",
  (req:any, res:any,next:any)=>{
    next();
  },
  asyncHandler(api.findBy)
);

router.post(
  "/import-from-file",
  // validateResource(frequencyCreateSchema),
  asyncHandler(api.createFromFile)
)
export default router;
