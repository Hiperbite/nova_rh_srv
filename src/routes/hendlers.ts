
import axios from 'axios';
import { Request, NextFunction, Response } from "express";

import { ApiError } from "./error.handler";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) return res.status(err.code).send(err.message);

  return res.status(500).send(err);
};

const toDataURL = async (url: string) => {
  const image: any = await axios.get(url, { responseType: 'arraybuffer' });
  let returnedB64 = Buffer.from(image.data).toString('base64');
  if (returnedB64)
    return 'data:' + image?.headers['content-type'] + ';base64,' + returnedB64;
  return ;
}
export default errorHandler;
export { ApiError, toDataURL };