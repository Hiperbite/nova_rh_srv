import express from "express";

import {
  getGeneratedDocument, getGeneratePayRollExtractFile, getGeneratePayStub, getGenerateSocialSecurityMapFile, getGenerateWiTaxFile
} from "../../api/common/document-generate.api";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

router.get(
  "/pay-stub/:id", asyncHandler(getGeneratePayStub)
)

  .get(
    '/get-witax-File/:id',
    asyncHandler(getGenerateWiTaxFile)
  )
  .get(
    '/get-social-security-file/:id',
    asyncHandler(getGenerateSocialSecurityMapFile)
  )
  .get(
    '/get-pay-roll-extract-file/:id',
    asyncHandler(getGeneratePayRollExtractFile)
  );
router.get(
  "/:id", asyncHandler(getGeneratedDocument)
);



export default router;