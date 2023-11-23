
import { EmployeeApi } from "../../api/employees/employee.api";
import express from "express";

/**
 * TODO: Find best place to put this stash
 * @param fn 
 * @returns 
 */
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const api = new EmployeeApi();
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
    asyncHandler(api.update)
  )

  .put(
    "/close-contract/:id",
    // validateResource(updateStudentSchema),
    asyncHandler(api.closeContract)
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
