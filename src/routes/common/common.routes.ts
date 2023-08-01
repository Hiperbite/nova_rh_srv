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
  Role,
} from "../../models/index";
import { DefaultRepository as Repository } from "../../repository/index";

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
// asyncHandler(
const router = express.Router();

interface modelsType {
  key: string;
  model: any;
}

const models: modelsType[] = [
  { key: "contacts", model: Contact },
  { key: "departments", model: Department },
  { key: "address", model: Address },
  { key: "roles", model: Role },
  { key: "salary-packages", model: SalaryPackage },
  { key: "additional-payments", model: AdditionalPayment },
  { key: "additional-fields", model: AdditionalField },
  { key: "additional-payment-types", model: AdditionalPaymentType },

  { key: "persons", model: Person },
  { key: "documents", model: Document },
  { key: "notifications", model: Notification },

  { key: "tickets", model: Ticket },
  { key: "ticket-states", model: TicketState },
  { key: "ticket-types", model: TicketType },

  { key: "events", model: Event },
  { key: "event-schedules", model: EventSchedule },
  { key: "event-types", model: EventType },
/*
  { key: "settings/local-setting", model: LocalSetting },
  { key: "settings/system-setting", model: SystemSetting },
  { key: "settings/document-setting", model: DocumentSetting },
  { key: "settings/license-setting", model: LicenseSetting },
  { key: "settings/setting", model: Setting },*/
];

models.forEach(({ model, key }: modelsType) => {

  const api = new Api(model);
  //let api:any ={}// new ModelApi<typeof model>(new Repository(model.scope('default')));
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

    .get(`/commons/${key}/:id`, asyncHandler(api.find))

    .get(`/commons/${key}/`, asyncHandler(api.findBy));
});

export default router;
