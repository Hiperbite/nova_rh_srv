import express from "express";
import Api from "../../api/Api";

import {
  Person,
} from "../../models/index";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();
const api = new Api(Person);


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

  .get("/:id", asyncHandler(api.find))

  .get("/", asyncHandler(api.findBy));
;

export default router;
