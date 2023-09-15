import { logger } from "config";

export const genericErrorHendler = (err: any, req: any, res: any, next: any) {
    // All errors from async & non-async route above will be handled here
    let errors = [];

    if (err?.original?.code === "ER_NO_REFERENCED_ROW_2") {
        errors = [{ message: `${err.table} not founds`, fields: err.fields }];
    } else if (err.errors?.length > 0) {
        errors = err.errors;
    } else if (typeof err.message === "string") {
        errors = [{ message: err.message }];
    } else if (Array.isArray(err) && err.length > 0) {
        errors = err;
    } else if (Array.isArray(err)) {
        errors = [{ message: "Some thing wrong is happning" }];
    } else if (err.data) {
        errors = [err.data];
    } else {
        errors = err;
    }

    res.status(err.code ?? 500).send(errors);
    logger.error({ message: errors, meta: { req, res } })
}

export const notFoundErrorHendler = (req: any, res: any, next: any) => {
    res.status(404).json([{ message: "resource not found" }]);
    logger.warn({ message: "resource not found", meta: { req, res } })
}

export const commonErrorHandler = (err: any, req: any, res: any, next: any) => {
    const { status } = err;
    res.status(status).json(err);
    logger.info({ message: err, meta: { req, res } })
}