import express from "express";

import {
  getGeneratedDocument, getGeneratePayStub, getGenerateWiTaxFile
} from "../../api/common/document-generate.api";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

router.get(
  "/pay-stub/:id", asyncHandler(getGeneratePayStub)
)

  .get(
    '/get-witax-File',
    getGenerateWiTaxFile
  );
router.get(
  "/:id", asyncHandler(getGeneratedDocument)
);



export default router;