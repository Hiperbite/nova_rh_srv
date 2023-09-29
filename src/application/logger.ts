import { NODE_ENV } from "../config";
import winston from "winston";
//const { NODE_ENV } = process.env;


const printLog = (info: any) => {
  try {
    const {
      ip,
      method,
      url,
      query,
      params,
      body,
      headers,
    }: any = info?.meta?.req ?? {};

    const log = {
      level: info.level,
      status: info.meta?.res?.statusCode,
      ip,
      message: info?.message,
      method,
      url,
      query,
      params,
      body,
    };
    console.log(info)
    return info;
  } catch (error) {
    console.error(error);
  }

  return "error writing logs";
}


export const errorLoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
};
export const loggerOptions = {
  transports: [
    new winston.transports.File({
      filename: `./logs/${NODE_ENV}-${((d = new Date()) =>
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0"))()}.log.json`,
    }),
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.printf(printLog),
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP > code: {{res.statusCode}}, METHOD: {{req.method}}, RESPONSE_TIME: {{res.responseTime}}ms, URL: {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
};
//app.use(expressWinston.logger(loggerOptions));

export const logger = winston.createLogger(loggerOptions);
export const log = logger;
export default log;
