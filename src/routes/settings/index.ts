import { Router } from "express";

const routes = Router();
import payrollSettingsRoutes from './payroll.settings.routes'


routes.use('/payrolls', payrollSettingsRoutes)


export default routes;

