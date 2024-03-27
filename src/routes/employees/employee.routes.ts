
import { EmployeeApi } from "../../api/employees/employee.api";
import express from "express";
import { afterUpload, uploader } from "../../services/drive/multer.uploader";
import multer from "multer";

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

const prepareAvatarUpload = (req: any, res: any, next: any) => {

  if (req?.file) {

    const { fieldname, mimetype, buffer } = req?.file
    if (fieldname === 'avatar') {
      const avatar = 'data:' + mimetype + ';base64,' + buffer.toString('base64')
      req.body = { ...req.body, avatar }
    }

  }

  next();
};
router
  .post(
    "/",
    // validateResource(createStudentSchema),

    asyncHandler(
      multer(
        {
          storage: multer.memoryStorage()
        }
      ).single('avatar')),

    asyncHandler(prepareAvatarUpload),

    asyncHandler(api.create)
  )



  .put(
    "/:id",

    asyncHandler(
      multer(
        {
          storage: multer.memoryStorage()
        }
      ).single('avatar')),

    asyncHandler(prepareAvatarUpload),

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
