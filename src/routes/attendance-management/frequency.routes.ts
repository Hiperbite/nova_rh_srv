import Api from "../../api/Api";
import express from "express";
import { Frequency } from "../../models/index";
import validateResource from "../../application/middleware/validateResource";
import { frequencyCreateSchema } from "../../application/schema/attendance/attendance.schema";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const api = new Api(Frequency);

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
  asyncHandler(api.findBy)
);
export default router;
