import { Sequelize } from "sequelize-typescript";

import {
  Model as Main,
  Column,
  DataType,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { uuid } from "uuidv4";

class Model extends Main {

  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id?: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  isActive!: boolean;

  @BeforeCreate
  static prepare = (model: Model) => {
    model.id = uuid();
    model.isActive = false;
  };

  @BeforeUpdate
  static prepareUpdate = (model: Model) => {
    model.id ||= uuid();
    model.isActive ||= true;
  };
}


import User from "./common/user";
import Token from "./common/token";
import Session from "./common/session";

import Address from "./employee/address";
import Contact from "./employee/contact";
import Employee from "./employee/employee";
import Attachment from "./employee/attachment";

import dotenv from "dotenv";
import Role from "./employee/role";
import Category from "./employee/category";
import Department from "./employee/department";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const connection = new Sequelize({
  repositoryMode: false,
  dialect: "mariadb",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: true,
  models: [User, Address, Token, Session, Contact, Employee, Attachment, Role, Category, Department],
});


export { connection, User,Model, Address,  Session, Token, Contact, Employee, Attachment , Role, Category, Department};
