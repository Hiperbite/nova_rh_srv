import Api from "../../api/Api";
import express from "express";
import { Attendance } from "./../../models/index";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
  const api = new Api(Attendance);
// asyncHandler(
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
    "/",
    asyncHandler(api.findBy)
  );

export default router;
