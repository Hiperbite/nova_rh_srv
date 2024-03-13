import { Router } from "express";
import commonRoutes from "./common/common.routes";
import userRoutes from "./common/user.routes";
import authRoutes from "./common/auth.routes";
import generateDocumentsRoutes from "./common/generate-documents.routes";
import attachFilesRoutes from "./common/attachFiles.routes";
import trackRoutes from "./common/track.routes";

import company from "./company/company.routes";
import business from "./company/business.routes";

import files from "./doc-manager/file.routes";
import fileIssuer from "./doc-manager/issuer.routes";
import fileType from "./doc-manager/file-type.routes";
import favoriteFile from "./doc-manager/favorite-file.routes";


import dashboards from "./common/dashBoard.routes";
import helpers from "./common/helper.routes";
import employees from "./employees/employee.routes";
import contracts from "./employees/contract.routes";
/* import ausence from "./employees/ausence.routes";
 */
import personal from "./employees/person.routes";
import accountpaymentdata from "./employees/account_payment_data.routes"

import payroll from "./payrolls/payroll.routes";
import settings from "./settings";

import attendance from "./attendance-management/attendance.routes";
import frequency from "./attendance-management/frequency.routes";
import attendanceType from "./attendance-management/attendance-type.routes";
import attendanceJustification from "./attendance-management/attendance-justification.routes";
import roleRoutes from "./employees/role.routes";

const routes = Router();


routes.use('/attendances/frequencies', frequency)
routes.use('/attendances/attendances', attendance)
routes.use('/attendances/justifications', attendanceJustification)
routes.use('/attendances/types', attendanceType)

routes.use('/users', userRoutes)
routes.use('/roles', roleRoutes)

routes.use('/auth', authRoutes)
routes.use('/tracks', trackRoutes)

routes.use('/drive/issuers', fileIssuer)
routes.use('/drive/file-types', fileType)
routes.use('/drive/files', files)
routes.use('/drive/favorite-files', favoriteFile)

//routes.use('/commons/contacts', contactRoutes)
routes.use('/commons/dashboards', dashboards)
routes.use('/commons/helpers', helpers)
routes.use('/commons/generate-documents', generateDocumentsRoutes)
routes.use('/commons/attach-files', attachFilesRoutes)

routes.use('/company/company', company)
routes.use('/company/business', business)

routes.use('/employees/employees', employees)
routes.use('/employees/account-payment-data', accountpaymentdata)
routes.use('/employees/contracts', contracts)
/* routes.use('/employees/ausence', ausence)
 */
routes.use('/employees/personal', personal)

routes.use('/payrolls/payroll', payroll)
routes.use('/settings', settings)


routes.use(commonRoutes)

export default routes;