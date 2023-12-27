import Api from "../../api/Api";
import express from "express";
import { Role } from "../../models/index";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const api = new Api(Role);
// asyncHandler(
const roleRoutes = express
  .Router()

roleRoutes.post(
  "/",
  asyncHandler(api.create)

)
roleRoutes.put(
  "/:id",
  asyncHandler(api.update)
);

roleRoutes.delete(
  "/:id",
  asyncHandler(api.delete)
);

roleRoutes.get(
  "/:id",
  asyncHandler(api.find)
);

roleRoutes.get(
  "/",
  asyncHandler(api.findBy)
);

export default roleRoutes;
