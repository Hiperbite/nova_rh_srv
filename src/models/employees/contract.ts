import { includes, orderBy } from "lodash";
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasOne,
  DefaultScope,
  HasMany,
} from "sequelize-typescript";

import { Model, Employee, Role, SalaryPackage, Department, Person, AdditionalField, WorkingHour, Payroll } from "../index";

@DefaultScope(() => ({
  include: [Role, AdditionalField, { model: Department, include: [{ as: 'department', model: Department }] }],
  orderBy: [['startDate', 'DESC']]
}))
@Scopes(() => ({
  default: {
    include: []
  },
  employee: {
    include: [Role, { model: Employee, include: [Person] }, { model: Department, include: [{ as: 'department', model: Department }] }],
    orderBy: [['startDate', 'DESC']]
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
  endDate?: Date | null;
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  startDate?: Date | null;

  @BelongsTo(() => Employee)
  employee?: Employee;

  @ForeignKey(() => Employee)
  employeeId?: string;

  @BelongsTo(() => Role)
  role!: Role;

  @ForeignKey(() => Role)
  roleId!: string;

  @BelongsTo(() => Department)
  department!: Department;

  @ForeignKey(() => Department)
  departmentId!: string;

  @HasMany(() => AdditionalField)
  additionalFields?: AdditionalField[]

  @HasMany(() => Payroll)
  payrolls?: Payroll[]

  @HasOne(() => SalaryPackage)
  salaryPackage?: SalaryPackage;

  @HasOne(() => WorkingHour)
  workingHour?: WorkingHour;
}



