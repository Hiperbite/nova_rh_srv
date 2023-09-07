import { DepartmentApp } from "../../application/company/department.app";
import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
  HasMany,
  DefaultScope,
} from "sequelize-typescript";

import { Model, Department as Dep, Contract, Employee } from "../index";

/*
@DefaultScope(() => ({
  include: [{ as: 'childs', model: Dep }]
}))
*/
@Scopes(() => ({
  default: {
    include: [{ model: Dep, as: 'department' }, { model: Dep, as: 'childs' }]
  },
  full: {
    include: [Contract, { model: Dep, as: 'department' }, { model: Dep, as: 'childs', include: [{ model: Dep, as: 'childs', include: [{ model: Dep, as: 'childs' }] }] }]
  }
}))
@Table({
  timestamps: true,
  tableName: "Departments",
})
export default class Department extends Model {
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

  @HasMany(() => Dep, 'departmentId')
  childs?: Dep[];

  @BelongsTo(() => Dep, 'departmentId')
  department?: Dep;

  @ForeignKey(() => Dep)
  departmentId?: string;


  @HasMany(() => Contract)
  contracts?: Contract[];

  @Column({
    type: DataType.VIRTUAL
  })
  get leaders() {
    return this.contracts
      ?.filter((c: Contract) => c?.isActive)
      ?.filter((c: Contract) => c?.role?.no !== undefined)
      ?.sort((p: Contract, n: Contract) => Number(p.role?.no) > Number(n.role?.no) ? -1 : 1)
      ?.map((c: Contract) => c?.employee)
      ?.find(() => true)

  }
  @Column({
    type: DataType.VIRTUAL
  })
  get employees() {
    return this.contracts
      ?.filter((c: Contract) => c?.isActive)
      ?.map((c: Contract) => c?.employee)

  }
  static filter = DepartmentApp.filter
}