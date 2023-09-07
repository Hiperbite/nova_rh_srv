import { Request, Response, NextFunction } from "express";
import { filter } from "lodash";
import sequelize from "../../models/index";
const uuidPattern = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { where, order: o, include: i }: any = req.query
  if (where) {
    Object.keys(where).forEach((key: string) => {
      if (where[key] && where[key].indexOf(',') > -1)
        where[key] = where[key].split(',');
      if (where[key] === 'true' || where[key] === 'false')
        where[key] = where[key] === 'true' ? true : false;
      if (where[key] === 'null')
        where[key] = null;
      if (where[key] === 'undefined')
        where[key] = null;
    })
    req.query.where = where
  }

  let { filter }: any =
    Object
      .values(sequelize.models)
      .find(({ tableName }: any) => tableName.toLowerCase() === req.path.split('/').pop()?.toLowerCase())??{}
  if (filter) {
    filter = filter(where ?? {})
    req.query.where = filter?.where
    req.query.include = filter?.include
    req.query.scope ??= filter.scope
    req.query.subQuery = undefined;
  }

  if (i) {
    const include = JSON.parse(i);
    req.query.include = i
  }

  if (o) {
    const order = o.split(',').map((p: any) => p.split('.'));
    //const newOrder: any = Object.keys(order).map((key) => [key, order[key]])
    req.query.order = order
  }
  if (req.params.id && !uuidPattern.test(req.params.id)) {
    throw { code: 400, message: `required a valid uuid param, ${req.params.id} given` }
  }

  return next();
};

export default validateRequest;
