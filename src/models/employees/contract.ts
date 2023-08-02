import { includes, orderBy } from "lodash";
import moment from "moment";
import { and } from "sequelize";
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

import { Model, Employee, /* Role, */ SalaryPackage, Department, Person, AdditionalField, WorkingHour, Payroll, Role, AdditionalPayment, AdditionalPaymentType } from "../index";

@DefaultScope(() => ({
  include: [
    Role,
    AdditionalField,

    { model: SalaryPackage, include: [{ model: AdditionalPayment, include: [AdditionalPaymentType] }] },
    { model: Department, include: [{ as: 'department', model: Department }] }],
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
  role?: Role;

  @ForeignKey(() => Role)
  roleId?: string;

  @BelongsTo(() => Department)
  department!: Department;

  @ForeignKey(() => Department)
  departmentId!: string;

  @HasMany(() => AdditionalField)
  additionalFields?: AdditionalField[]

  @HasMany(() => Payroll)
  payrolls?: Payroll[] //= [new Payroll()]

  @Column({
    type: DataType.VIRTUAL
  })
  get actualPayrollState() {

    let myPayrolls: any[] = [];
    const startDate = moment(this.startDate);
    let current = startDate.add(1, 'm');
    const newPayroll = new Payroll()
    newPayroll.contract = this;
    while (current.isBetween(this.startDate, this.endDate) && current.isBefore(moment())) {
      newPayroll.date = current.toDate();
      newPayroll.isActive = false;

      let currentPayrolls = (this?.payrolls?.find((p: Payroll) => moment(p?.date).format('Y-M') === current.format('Y-M')) ?? newPayroll)?.proposalLines

      const grossValue = currentPayrolls.filter(({ debit }: any) => debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
      const discountValue = currentPayrolls.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
      myPayrolls.push({
        date: current.format('Y-M'),
        fromDate: current.format('Y-M'),
        toDate: current.format('Y-M'),
        grossValue,
        discountValue,
        netValue: grossValue - discountValue,
        payrolls: currentPayrolls,
        state: 0,
      })
      current = current.add(1, 'M');
    }
    return myPayrolls;

  }
  @HasOne(() => SalaryPackage, { as: 'salaryPackage' })
  salaryPackage?: SalaryPackage;

  @HasOne(() => WorkingHour)
  workingHour?: WorkingHour;
}



