import { Application } from "express";
import deserializeUser from "../application/middleware/deserializeUser";
import validateRequest, { routerRequest } from "../application/middleware/validateRequest";
import routes from "./routes";
import { MY_NODE_ENV } from "../config";
import { initializer } from "../models/initializer";
import { commonErrorHandler, genericErrorHendler, notFoundErrorHendler } from "../application/middleware/errorHendler";
import requireAuthentication from "../application/middleware/requireAuthentication";

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

        res.status(200).send(`Hey ${req.ip}, I'm alive on ${MY_NODE_ENV?.toUpperCase()} env`)
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
