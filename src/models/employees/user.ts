import {
  Table,
  AllowNull,
  Default,
  Column,
  DataType,
  BeforeCreate,
  BeforeSave,
  HasOne,
  AfterCreate,
  AfterSave,
  AfterUpdate,
  createIndexDecorator,
  Scopes,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Model, Address, Employee, Person } from "../index";

import bcrypt from "bcrypt";
import { UserApp } from "../../application/common/user.app";
import sendEmail, { mailServices } from "../../application/mailler/index";

const UniqIndex = createIndexDecorator({
  name: 'Email-index',
  type: 'UNIQUE',
  unique: true,
});
export type ROLES =
  | 'ROLES_STUDENT'
  | 'ROLES_PROFESSOR'
  | 'ROLES_TECHNICAL'
  | 'ROLES_MANAGER'
  | 'ROLES_OFFICE_CHEF'

export type PermissionsType =
  | "STUDENTS_1"
  | "STUDENTS_2"
  | "STUDENTS_3"
  | "STUDENTS_4"
  | "CANDIDATES_1"
  | "CANDIDATES_2"
  | "CANDIDATES_3"
  | "CANDIDATES_4"
  | "CLASS_1"
  | "CLASS_2"
  | "CLASS_3"
  | "CLASS_4"
  | "CLASSIFICATION_1"
  | "CLASSIFICATION_2"
  | "CLASSIFICATION_3"
  | "CLASSIFICATION_4"
  | "STAFF_1"
  | "STAFF_2"
  | "STAFF_3"
  | "STAFF_4"
  | "TABLES_1"
  | "TABLES_2"
  | "TABLES_3"
  | "TABLES_4"
  | "ADMIN_1"
  | "ADMIN_2"
  | "ADMIN_3"
  | "ADMIN_4"
  | "ACADEMIC_1"
  | "ACADEMIC_2"
  | "ACADEMIC_3"
  | "ACADEMIC_4"

@Scopes(() => ({
  main: {
    include: []
  },
  auth: {
    include: []
  },
  full: {
    include: [{
      model: Employee,
      include: [{
        model: Person, include: [
          { model: Address, as: 'livingAddress' },
          { model: Address, as: 'birthPlaceAddress' },
        ]
      }]
    }]
  }
}))
@Table({
  timestamps: true,
  tableName: "Users",
})
export default class User extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  // @UniqIndex
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })

  get permissions() {
    return (this.getDataValue('permissions') ?? '')
      .split(',')
      .map((p: string) => p.split('_'))
      .map((p: string[]) => [p[0], Number(p[1])])
      .map(([l, v]: any) => ({ [l]: v }))
      .reduce((x: any, y: any) => ({ ...x, ...y }))
      ?? []
  }
  set permissions(roles: string[]) {
    this.setDataValue('permissions', Object.entries(roles).map((p: any) => p.join('_')).join(','))
  }

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role!: ROLES;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isNew?: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  salt?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  accessToken?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  passwordResetCode?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  verificationCode?: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  verified?: boolean;

  @BeforeSave
  @BeforeCreate
  static initVer = UserApp.initVer;

  @BeforeCreate
  static sendMail = UserApp.sendMail;

  @BeforeSave
  static hashPassword = UserApp.hashPassword;


  @BelongsTo(() => Employee)
  employee!: Employee

  @ForeignKey(() => Employee)
  employeeId!: string;

  @AfterCreate
  static notifyUser = (user: User) =>
    User.scope('full').findByPk(user?.id).then((data: User | null) =>
      sendEmail({
        service: mailServices["createUser"],
        data
      })
    )


  @AfterUpdate
  @AfterCreate
  @AfterSave
  static async refreshPersons(user: User) {
    // const person = await Person.findByPk(user.personId);
    /*
        if (person && person.userId === null) {
          person.userId = user.id;
          person?.save();
        } else {
          if (person) user.person = person;
        }*/
  }

  //TODO: fix password compare
  passwordCompare = async (password: string) => {
    const myPassword = this.password ?? "";
    const verified = await bcrypt.compare(password, myPassword);

    return verified;
  };
  privateFields: string[] = [
    "id",
    "username",
    "email",
    "role",
    "verified",
    "personId",
    "person",
    "permissions",
    "isNew",
  ];
}
