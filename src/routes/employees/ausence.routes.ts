import express from "express";
import Api from "../../api/Api";

import { Ausence } from "../../models/index";
const api = new Api(Ausence);

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>  Promise.resolve(fn(req,res,next)).catch(next)

router.post("/", asyncHandler(api.create))
router.get("/", asyncHandler(api.findBy))
router.get("/:id", asyncHandler(api.find))
router.put("/:id", asyncHandler(api.update))
router.delete("/:id", asyncHandler(api.delete))

export default router;
