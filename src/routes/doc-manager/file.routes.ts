import { File } from "../../models";
import express from "express";
import Api from "../../api/Api";
import { afterUpload, dirSize, downloader, uploader } from "../../services/drive/multer.uploader";
import { DISK_PATH } from "../../config";

/**
 * TODO: Find best place to put this stash
 * @param fn 
 * @returns 
 */
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);


const api = new Api(File);

// asyncHandler(
const router = express.Router();

router
  .post(
    "/",
    // validateResource(createStudentSchema),

    asyncHandler(uploader),

    asyncHandler(afterUpload),
    //afterUpload,
    asyncHandler(api.create),
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
    asyncHandler(api.findBy)
  )
  .get("/download/:id",
    // validateResource(updateStudentSchema),
    //asyncHandler(api.find),

    asyncHandler(downloader)

  )
  .get("/my-disk/size",
    // validateResource(updateStudentSchema),
    //asyncHandler(api.find),

    asyncHandler(async (req: any, res: any) => {
      const size = await dirSize(DISK_PATH ?? '');
      console.log(size);
      res.send({size})
    })

  )

  ;
;

export default router;
