import { EmployeeRoleApp } from "../../application/company/employee-role.app";
import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

import { Model   } from "../index";


@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "EmployeeRoles",
})
export default class EmployeeRole extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  no?: number;

  static filter = EmployeeRoleApp.filter
}

