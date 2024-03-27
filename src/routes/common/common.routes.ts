import Api from "../../api/Api";
import express from "express";
import {
  Address,
  Document,
  EventType,
  Notification,
  Person,
  Ticket,
  TicketState,
  TicketType,
  Event,
  EventSchedule,

  LocalSetting,
  SystemSetting,
  DocumentSetting,
  LicenseSetting,
  Setting,
  Department,
  Contact,
  AdditionalPaymentType,
  SalaryPackage,
  AdditionalPayment,
  AdditionalField,
  EmployeeRole,
  Payroll,
  Country,
  AccountPaymentData,
  ContactType,
  WorkingHour,
  Track,
  PayStub,
  Bank,
  Category,
  WITaxTable,
  PayrollLine,
  PayrollLineType,
  Currency,
  AdvancePayment,
  DocumentTypeSetting 
} from "../../models/index";
import { DefaultRepository as Repository } from "../../repository/index";


const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

interface modelsType {
  key: string;
  model: any;
  midllewares?: any[];
}

const models: modelsType[] = [
  { key: "contacts", model: Contact, midllewares: [] },
  { key: "departments", model: Department },
  { key: "address", model: Address },
  { key: "contact-types", model: ContactType },
  { key: "employeeroles", model: EmployeeRole },
  { key: "categories", model: Category },
  { key: "salary-packages", model: SalaryPackage },
  { key: "advance-payments", model: AdvancePayment },
  { key: "additional-payments", model: AdditionalPayment },
  { key: "additional-fields", model: AdditionalField },
  { key: "additional-payment-types", model: AdditionalPaymentType },
  { key: "working-hours", model: WorkingHour },
  { key: "payroll", model: Payroll },
  { key: "pay-stubs", model: PayStub },
  { key: "pay-stub-lines", model: PayrollLine },
  { key: "pay-stub-line-types", model: AdditionalPaymentType },
  { key: "wi-tax-tables", model: WITaxTable },
  { key: "account-payment-datas", model: AccountPaymentData },
  { key: "banks", model: Bank },

  { key: "settings/document-types", model: DocumentTypeSetting },

  { key: "persons", model: Person },
  { key: "documents", model: Document },
  { key: "notifications", model: Notification },

  { key: "tickets", model: Ticket },
  { key: "ticket-states", model: TicketState },
  { key: "ticket-types", model: TicketType },

  { key: "tracks", model: Track },
  { key: "events", model: Event },
  { key: "event-schedules", model: EventSchedule },
  { key: "event-types", model: EventType },
  { key: "countries", model: Country },
  { key: "currencies", model: Currency },
];

models.forEach(({ model, key, midllewares = [] }: modelsType) => {

  const api = new Api(model);

  router
    .post(
      `/commons/${key}/`,
      // validateResource(createStudentSchema),
      asyncHandler(api.create)
    )

    .put(
      `/commons/${key}/:id`,
      // validateResource(updateStudentSchema),
      asyncHandler(api.update)
    )

    .delete(
      `/commons/${key}/:id`,
      // validateResource(updateStudentSchema),
      asyncHandler(api.delete)
    )

    .get(`/commons/${key}/:id`,
      midllewares,
      asyncHandler(api.find))

    .get(`/commons/${key}/`,
      midllewares,
      asyncHandler(api.findBy));
});

export default router;
