import { includes } from "lodash";
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasOne,
  DefaultScope,
} from "sequelize-typescript";

import { Model, Employee, Role, SalaryPackage } from "../index";

@DefaultScope(() => ({
  include: [Role]
}))
@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "Contracts",
})
export default class Contract extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  type?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  endDate?: string;
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  startDate?: string;

  @BelongsTo(() => Employee)
  employee?: Employee;

  @ForeignKey(() => Employee)
  employeeId?: string;

  @BelongsTo(() => Role)
  role?: Role;

  @ForeignKey(() => Role)
  roleId?: string;

  @HasOne(() => SalaryPackage)
  salaryPackage?: SalaryPackage;
}



