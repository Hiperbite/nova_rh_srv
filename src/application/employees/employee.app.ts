import { Track, User } from "../../models/index";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import sendEmail, { mailServices } from "../mailler/index";
import { Op } from "sequelize";

export type HistoryEventType =
  "created" |
  "registered" |
  "updated" |
  "deleted" |
  "upgared" |
  "downgraded";
export type HistoryEventState =
  "primary" |
  "secondary" |
  "success" |
  "danger" |
  "warning" |
  "info" |
  "light" |
  "dark"
  ;
export type HistoryType = {
  no: number,
  date: Date,
  type: HistoryEventType,
  descriptions: string,
  state: HistoryEventState,
  body?: any,
  user?: User
}
export class EmployeeApp {

  static hashPassword = async (user: User) => {

    if ((user.changed() || []).filter(x => x === 'password').length === 0)
      return;

    const saltRounds = 10;
    try {
      // Generate a salt
      user.salt = await bcrypt.genSalt(saltRounds);

      // Hash password
      user.password = await bcrypt.hash(user.password ?? "", user.salt);

      console.log(user.password);
    } catch (error) {
      console.log(error);
    }
  };

  static sendMail = async (user: User) =>
    null;
  static createUser = async (user: User) =>
    sendEmail(
      {
        service: mailServices.createUser,
        data: user
      })

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

  static history = async (user: User): Promise<HistoryType[]> => {
    const histories: HistoryType[] = [];

    let no = 0;
    let refersTrack: any[] = [];

    const where = { [Op.or]: refersTrack.map(({ model, id: ref }: any) => ({ [Op.and]: { model, ref } })) }
    const tracks = await Track.findAll({ where });
    tracks.forEach((track: Track) => {
      histories.push(
        {
          no: no++,
          date: track.createdAt,
          type: 'created',
          descriptions: `Foi alterado dados de ${track?.model}`,
          body: track,
          state: 'success'
        })
    })

    return histories.sort((a: any, b: any) => Date.parse(a.date) - Date.parse(b.date) ? -1 : 1)
  }

}
