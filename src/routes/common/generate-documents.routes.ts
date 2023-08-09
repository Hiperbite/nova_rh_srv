import express from "express";

import {
  getGeneratedDocument
} from "../../api/common/document-generate.api";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

router.get(
  "/:id", asyncHandler(getGeneratedDocument)
);

export default router;