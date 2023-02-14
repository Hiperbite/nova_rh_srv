import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  BeforeCreate,
  BeforeSave,
  HasOne,
  AfterCreate,
  AfterSave,
} from "sequelize-typescript";
import User from "../common/user";
import {
  Contact,
  Model,
  Address,
  Role,
  Category,
  Department,
  Attachment,
  Payroll,
  Paypack,
  Sequence,
  Document,
} from "../index";

import SequenceApp, { CODES } from "../../application/common/sequence.app";
import Person from "./person";
type MaritalstatusType =
  | "SINGLE"
  | "MARrIED"
  | "DIVORCED"
  | "WIDOWED"
  | "OTHER";

@Table({
  timestamps: true,
  tableName: "Employees",
})
export default class Employee extends Model {
  @Column({
    type: DataType.STRING,
    //     allowNull: false,
  })
  code!: string;
  @ForeignKey(() => User)
  id?: string;

  @HasOne(() => User)
  peson?: Person;

  @ForeignKey(() => Role)
  roleId?: string;

  @BelongsTo(() => Role)
  role?: Role;

  @ForeignKey(() => Category)
  categoryId?: string;

  @BelongsTo(() => Category)
  category?: Category;

  @ForeignKey(() => Department)
  departmentId?: string;

  @BelongsTo(() => Department)
  department?: Department;

  @HasMany(() => Attachment)
  attachments?: Attachment[];

  @HasMany(() => Payroll)
  payrolls?: Payroll[];

  @HasMany(() => Paypack)
  paypacks?: Paypack[];

  @BeforeCreate
  @BeforeSave
  static initModel = async (employee: Employee) => {
    if (employee.code === undefined) {
      employee.update({ code: await SequenceApp.count(CODES.EMPLOYEE) });
    }
  };
}

export { MaritalstatusType };
