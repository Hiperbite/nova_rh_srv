import Api from "../../api/Api";
import express from "express";
import { Level } from "../../models/index";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const api = new Api(Level);
// asyncHandler(
const LevelRoutes = express
  .Router()

LevelRoutes.post(
  "/",
  asyncHandler(api.create)

)
LevelRoutes.put(
  "/:id",
  asyncHandler(api.update)
);

LevelRoutes.delete(
  "/:id",
  asyncHandler(api.delete)
);

LevelRoutes.get(
  "/:id",
  asyncHandler(api.find)
);

LevelRoutes.get(
  "/",
  asyncHandler(api.findBy)
);

export default LevelRoutes;
