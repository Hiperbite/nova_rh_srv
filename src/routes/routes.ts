import { Router } from "express";
import commonRoutes from "./common/common.routes";
import userRoutes from "./common/user.routes";
import authRoutes from "./common/auth.routes";
import generateDocumentsRoutes from "./common/generate-documents.routes";
import trackRoutes from "./common/track.routes";

import company from "./company/company.routes";
import business from "./company/business.routes";

import dashboards from "./common/dashBoard.routes";
import helpers from "./common/helper.routes";
import employees from "./employees/employee.routes";
import contracts from "./employees/contract.routes";
import ausence from "./employees/ausence.routes";
import personal from "./employees/person.routes";
import accountpaymentdata from "./employees/account_payment_data.routes"

import payroll from "./payrolls/payroll.routes";

const routes = Router();

routes.use('/users', userRoutes)
routes.use('/auth', authRoutes)
routes.use('/tracks', trackRoutes)
//routes.use('/commons/contacts', contactRoutes)
routes.use('/commons/dashboards', dashboards)
routes.use('/commons/helpers', helpers)
routes.use('/commons/generate-documents', generateDocumentsRoutes)

routes.use('/company/company', company)
routes.use('/company/business', business)

routes.use('/employees/employees', employees)
routes.use('/employees/account-payment-data', accountpaymentdata)
routes.use('/employees/contracts', contracts)
routes.use('/employees/ausence', ausence)
routes.use('/employees/personal', personal)

routes.use('/payrolls/payroll', payroll)

routes.use(commonRoutes)

export default routes;