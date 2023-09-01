import express from "express";
import Api from "../../api/Api";

import { Company } from "./../../models/index";

/**
 * TODO: Find best place to put this stash
 * @param fn 
 * @returns 
 */

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const api = new Api(Company);
const router = express.Router();

router.post("/", asyncHandler(api.create));
router.put("/:id", asyncHandler(api.update));
router.delete("/:id", asyncHandler(api.delete));
router.get("/:id", asyncHandler(api.find));
router.get("/", asyncHandler(api.findBy));

export default router;
