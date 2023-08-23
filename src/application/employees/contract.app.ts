import { Track, User } from "../../models/index";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import sendEmail, { mailServices } from "../mailler/index";
import { Op } from "sequelize";

export class ContractApp {

  static initVer = async (user: User) => {
    user.verificationCode = uuid().substring(5, 12).toUpperCase();
    user.verified = true;
  };

  static filter = (filter: any) => {
    const { code, name, roleId, departmentId, date, antiqueness } = filter
    const fil = {
      code,
      name,
      roleId,
      departmentId,
      date,
      antiqueness,
    }

    return fil
  }

}
