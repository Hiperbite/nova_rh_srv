import { ipInfoApi } from "../providers/IpInfo.api";
import winston from "winston";
import moment from "moment";



const printLog = (info: any) => {
  try {


    ipInfoApi().then(data => {
      info.client = data;


      return info;
    })

    return info;
  } catch (error) {
    //console.log(error);
    return "error writing logs";
  }
  return info;
}
const transports: any = [
  new winston.transports.File({
    filename: `./logs/log-${moment().format('YYYY-MM-DD')}.log`,
  }),
  new winston.transports.Console(),
];
const
  format = winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
   // winston.format.printf(printLog),
  );
export const errorLoggerOptions = {
  transports,
  format
};
export const loggerOptions = {
  transports,
  format,
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP > code: {{res.statusCode}}, METHOD: {{req.method}}, RESPONSE_TIME: {{res.responseTime}}ms, URL: {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
};
//app.use(expressWinston.logger(loggerOptions));

export const logger = winston.createLogger(loggerOptions);
export const log = logger;
export default log;
