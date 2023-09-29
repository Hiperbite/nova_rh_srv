import validateResource from "../../application/middleware/validateResource";

import express from "express";

import {
  attachDepartmentData,
  attachEmployeeData
} from "../../api/common/attach-files-data.api";
import { attachDepartmentSchema } from "../../application/schema/common/attach-file.schema";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

router.post(
  "/employees", /* validateResource(attachEmployeeSchema), */ asyncHandler(attachEmployeeData)
);

router.post(
  "/departments", validateResource(attachDepartmentSchema), asyncHandler(attachDepartmentData)
);

export default router;