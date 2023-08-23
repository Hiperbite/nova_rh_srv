import express from "express";

import {
  attachEmployeeData
} from "../../api/common/attach-employee-data.api";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

router.post(
  "/", asyncHandler(attachEmployeeData)
);



export default router;