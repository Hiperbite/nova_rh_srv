import express from "express";
import api from "api/common/contact.api";

import {
  Address,
  Contact,
  
  Document,
  Person,
  
} from "models/index";
import { DefaultRepository as Repository } from "repository/index";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
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

    .get("/:id", asyncHandler(api.find))

    .get("/", asyncHandler(api.findBy));
;

export default router;
