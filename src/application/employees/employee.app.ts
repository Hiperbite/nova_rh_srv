import { includes } from 'lodash';
import { Contract, Employee, Person, Track, User } from "../../models/index";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import sendEmail, { mailServices } from "../mailler/index";
import { Op } from "sequelize";
import moment from 'moment';

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
    let { q, code, name, roleId, departmentId, date, antiqueness } = filter

    let where: any = {}
    const include: any = Employee?.options;
    const myInclude = include.scopes.default.include

    if (q) {
      name = q
    } else {
      if (code)
        where.code = code;

      if (date)
        where[Op.and] = [{
          createdAt: {
            [Op.gte]: date + ' 00:00:00'
          }
        }, {
          createdAt: {
            [Op.lte]: date + ' 23:59:59'
          }
        }];
    }
    for (let m of myInclude) {

      delete m.where
      if (m.as === 'person') {
        if (name)
          m.where = {
            [Op.or]: [
              { lastName: { [Op.like]: `%${name}%` } },
              { otherNames: { [Op.like]: `%${name}%` } },
              { firstName: { [Op.like]: `%${name}%` } },
            ]
          }

      }

      if (m.as === 'contracts') {
        delete m?.where?.isActive
        delete m?.where?.roleId
        if (roleId) {
          m.where = {
            roleId: roleId,
            isActive: true
          }
        }

        delete m?.where?.departmentId
        if (departmentId) {
          m.where = {
            isActive: true,
            departmentId: departmentId
          }
        }

        delete m?.where?.date
        if (antiqueness) {

          const antiquenessDate = moment().add(Number(antiqueness) * (-1), 'years').format('Y-MM-DD');
          m.where = {
            isActive: true,
            startDate: { [Op.lte]: antiquenessDate }
          }
        }
      }
    }

    return {
      where,
      scope: 'default',
      include: myInclude
    }
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
