import express from "express";
import {
  createSessionHandler,
  lockAccessTokenHandler,
  refreshAccessTokenHandler,
} from "../../api/common/auth.api";
import validateResource from "../../application/middleware/validateResource";
import { createSessionSchema } from "../../application/schema";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express
  .Router()

  .post(
    "/",
    validateResource(createSessionSchema),
    asyncHandler(createSessionHandler)
  )

  .post("/refresh", asyncHandler(refreshAccessTokenHandler))
  
  .post("/lock-session", asyncHandler(lockAccessTokenHandler))
  ;

export default router;
