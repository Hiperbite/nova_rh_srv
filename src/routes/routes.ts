import { Router } from "express";
import userRoutes from "./common/user.routes"
import authRoutes from "./common/auth.routes"

const routes = Router();

routes.use('/users',userRoutes) 
routes.use('/auth',authRoutes) 

export default routes;