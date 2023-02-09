import { Router } from "express";
import transactionTypeRoutes from "./transaction-type.routes";

const routes = Router();

routes.use('/transaction-types',transactionTypeRoutes) 

export default transactionTypeRoutes;