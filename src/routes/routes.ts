import { Router } from "express";
import commonRoutes from "./common/common.routes";
import userRoutes from "./common/user.routes";
import authRoutes from "./common/auth.routes";
import trackRoutes from "./common/track.routes";

import company from "./company/company.routes";

import dashboards from "./common/dashBoard.routes";
import helpers from "./common/helper.routes";
import employees from "./employees/employee.routes";
import contracts from "./employees/contract.routes";
import personal from "./employees/person.routes";

import payroll from "./payrolls/payroll.routes";

const routes = Router();

routes.use('/users', userRoutes)
routes.use('/auth', authRoutes)
routes.use('/tracks', trackRoutes)
//routes.use('/commons/contacts', contactRoutes)
routes.use('/commons/dashboards', dashboards)
routes.use('/commons/helpers', helpers)

routes.use('/company', company)

routes.use('/employees/employees', employees)
routes.use('/employees/contracts', contracts)
routes.use('/employees/personal', personal)

routes.use('/payrolls/payroll', payroll)

routes.use(commonRoutes)

export default routes;