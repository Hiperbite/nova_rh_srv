import express from "express";
import Api from "../../api/Api";

import { Business } from "./../../models/index";

/**
 * TODO: Find best place to put this stash
 * @param fn 
 * @returns 
 */

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req,res,next)).catch();

const api = new Api(Business);
const router = express.Router();

router.get("/", asyncHandler(api.findBy));
router.post("/", asyncHandler(api.create));
router.put("/:id", asyncHandler(api.update));
router.delete("/:id", asyncHandler(api.delete));
router.get("/:id", asyncHandler(api.find));

export default router;
