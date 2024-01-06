import { Application } from "express";
import deserializeUser from "../application/middleware/deserializeUser";
import validateRequest, { routerRequest } from "../application/middleware/validateRequest";
import routes from "./routes";
import { MY_NODE_ENV, NODE_ENV } from "../config";
import { initializer } from "../models/initializer";
import { commonErrorHandler, genericErrorHendler, notFoundErrorHendler } from "../application/middleware/errorHendler";
import requireAuthentication from "../application/middleware/requireAuthentication";

import { PayStub } from "../models/index";
import WITaxApp from "../application/payrolls/wi_tax.app";
import PayRollApp from "../application/payrolls/pay_roll.app";

export const asyncHandler = (fn: any, model?: any) => (req: any, res: any, next: any) => {
  req.model = model
  Promise.resolve(fn(req, res, next)).catch((err: any) => {
    next(err);
  });
}

const router = (app: Application) => {

  app.use(routerRequest)

    .get(
      "/",
      asyncHandler(async (req: any, res: any) => {
        const xml=await PayRollApp.generateWiTaxReportXML(2023,10)
        res.header("Content-Type", "application/xml");
        return res.send(xml);

        const ip = req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
        res.status(200).send(`Hey ${ip}, I'm alive on ${MY_NODE_ENV?.toUpperCase()}/${NODE_ENV?.toUpperCase()} env`)
      })
    )

    .get(
      "/initializer",
      asyncHandler(async (req: any, res: any) => {
        initializer()
        res.status(200).send(`Hey ${req.ip}, I'm alive on ${MY_NODE_ENV?.toUpperCase()} env`)
      })
    )

    .use(
      "/api/v1/",
      [
        routerRequest,
        deserializeUser,
        requireAuthentication,
        validateRequest
      ],
      routes
    )

    // Add more routes here

    // Error handler
    .use(genericErrorHendler)

    // Error handler
    // All errors from async & non-async route above will be handled here
    .use(notFoundErrorHendler)

    .use(commonErrorHandler);
};

export default router;
