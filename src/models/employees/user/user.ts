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
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { Model, Address, Employee, Person, Role } from "../../index";

import bcrypt from "bcrypt";
import { UserApp } from "../../../application/common/user.app";
import sendEmail, { mailServices } from "../../../application/mailler/index";
import { randomUUID } from "crypto";

const UniqIndex = createIndexDecorator({
  name: 'Email-index',
  type: 'UNIQUE',
  unique: true,
});

@Scopes(() => ({
  main: {
    include: []
  },
  auth: {
    include: [{
      model: Employee,
      attributes: ['avatar'],
      include: [{
        model: Person,
        attributes: ['firstName', 'lastName', 'fullName'],
        includes: ['firstName', 'lastName', 'fullName'],
      }]
    }]
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
    allowNull: true,
  })
  username?: string;

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
    if (roles)
      this.setDataValue('permissions', Object.entries(roles).map((p: any) => p.join('_')).join(','))
  }

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role!: string;

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



  @BelongsTo(() => Employee)
  employee!: Employee

  @ForeignKey(() => Employee)
  employeeId!: string;

  @HasMany(() => Role)
  roles!: Role[]

  @BeforeSave
  @BeforeCreate
  static initVer = UserApp.initVer;

  @BeforeCreate
  static sendMail = UserApp.sendMail;


  @BeforeSave
  static hashPassword = UserApp.hashPassword;




  @AfterCreate
  static notifyUser = (user: User) =>
    User.scope('full').findByPk(user?.id).then((data: User | null) => {
      if (data?.employee?.code && data?.employee?.code?.indexOf('A') < 0)
        sendEmail({
          service: mailServices["createUser"],
          data
        })
    }

    )
  @BeforeCreate
  static setUserName = (user: User) => user.username ||= randomUUID()

  @AfterUpdate
  @AfterCreate
  @AfterSave
  static async refreshPersons(user: User) {

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
    "employeeId",
    "person",
    "personId",
    "employee",
    "permissions",
    "isNew",
  ];
}
