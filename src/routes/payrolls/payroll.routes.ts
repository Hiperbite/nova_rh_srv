import express from "express";
import Api from "../../api/Api";

import {
  Payroll,
} from "../../models/index";

/**
 * TODO: Find best place to put this stash
 * @param fn 
 * @returns 
 */
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const api = new Api(Payroll);
// asyncHandler(
const router = express.Router();

router
  .post(
    "/",
    // validateResource(createStudentSchema),
    asyncHandler(api.create)
  )

  .put(
    "/:id",
    // validateResource(updateStudentSchema),
    asyncHandler(api.update)
  )

  .delete(
    "/:id",
    // validateResource(updateStudentSchema),
    asyncHandler(api.delete)
  )

  .get("/:id",
    // validateResource(updateStudentSchema),
    asyncHandler(api.find))

  .get("/",
    // validateResource(updateStudentSchema),
    asyncHandler(api.findBy));
;

export default router;
