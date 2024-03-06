import { DepartmentApp } from "../../application/company/department.app";
import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";

import { Model, Department as Dep, Contract, Employee, Person, EmployeeRole, Category } from "../index";


/*
@DefaultScope(() => ({
  include: [{ as: 'childs', model: Dep }]
}))
*/
@Scopes(() => ({
  simple:{
    //include: [{ model: Dep, as: 'department' },{ model: Dep, as: 'childs' },]
  },
  default: {
    include: [{ model: Contract, include: [Employee] }, { model: Dep, as: 'department' }, { model: Dep, as: 'childs' }]
  },
  full: {
    include: [{ model: Contract, include: [{ model: Employee, include: [Person] }, EmployeeRole, Category] }, { model: Dep, as: 'childs' }]
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
    let y: any = this.contracts
    y = y?.filter((c: Contract) => c?.isActive);
    //y = y?.filter((c: Contract) => c?.role?.no !== undefined);
    
    y = y?.sort((p: Contract, n: Contract) => Number(p.category?.no??0) > Number(n.category?.no??0) ? -1 : 1);

    //y = y?.sort((p: Contract, n: Contract) => moment(p.startDate).isBefore(n.startDate) ? -1 : 1);
    y = y?.map((c: Contract) => c?.employee);
    y = y?.find(() => true);
    return y
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