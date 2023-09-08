import moment from "moment";
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
  BeforeCreate,
} from "sequelize-typescript";

import { Model, Employee, SalaryPackage, Department, Person, AdditionalField, WorkingHour, PayStub, Role, AdditionalPayment, AdditionalPaymentType, User } from "../index";

@DefaultScope(() => ({
  include: [
    Role,
    AdditionalField,
    WorkingHour,
    { model: Employee, include: [Person, { model: User, as: 'user' }] },
    { model: SalaryPackage, include: [{ model: AdditionalPayment, include: [AdditionalPaymentType] }] },
    { model: Department, include: [{ as: 'department', model: Department }] }],
  orderBy: [['startDate', 'DESC']]
}))
@Scopes(() => ({
  default: {

  },
  coworkers: {
    attributes: { exclude: ['payStubState', 'departmentId', 'department', 'additionalFields', 'salaryPackage', 'workingHour'] },
    include: [Role,
      { model: Employee, include: [Person, { model: User, as: 'user' }] }]
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
  startDate!: Date;

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

  @HasMany(() => PayStub)
  payStubs?: PayStub[]

  @Column({
    type: DataType.VIRTUAL
  })
  get actualPayrollState() {

    let myPayrolls: any[] = [];
    const startDate = moment(this.startDate);
    let current = startDate.add(1, 'm');
    const newPayroll = new PayStub()
    newPayroll.contract = this;
    while (current.isBetween(this.startDate, this.endDate) && current.isBefore(moment())) {
      newPayroll.date = current.toDate();
      newPayroll.isActive = false;

      let currentPayrolls = (this?.payStubs?.find((p: PayStub) => moment(p?.date).format('Y-M') === current.format('Y-M')) ?? newPayroll)?.proposalLines

      const grossValue = currentPayrolls.filter(({ debit }: any) => debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
      const deductionValue = currentPayrolls.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
      myPayrolls.push({
        date: current.format('Y-M'),
        fromDate: current.format('Y-M'),
        toDate: current.format('Y-M'),
        grossValue,
        deductionValue,
        netValue: grossValue - deductionValue,
        payrolls: currentPayrolls,
        state: 0,
      })
      current = current.add(1, 'M');
    }
    return myPayrolls;

  }
  @Column({
    type: DataType.VIRTUAL
  })
  get payStubState() {

    const salaryPackage: any = this?.salaryPackage
    const additionalPayments: any = salaryPackage?.additionalPayments

    let lines: any[] = []
    lines.push({
      isActive: true,
      code: '1000',
      date: new Date(),
      value: Number(salaryPackage?.baseValue),
      debit: true,
      quantity: 1,
      baseValuePeriod: salaryPackage?.baseValuePeriod,
      descriptions: 'Base',

    })
    additionalPayments?.
      filter(({ isActive }: any) => isActive).
      filter(({ startDate }: any) => moment().isAfter(moment(startDate))).
      map(({ code, descriptions, startDate, isActive, baseValue, baseValuePeriod, type }: any) => (
        {
          isActive,
          code: type?.code,
          date: new Date(),
          startDate,
          value: Number(baseValue),
          property: 1,
          debit: true,
          baseValuePeriod,
          descriptions: type?.name
        }
      )
      )?.forEach((x: any) => lines.push(x));

    const grossValue: number = lines?.map((x: any) => Number(x?.value))?.reduce((x: any, y: any) => x + y)

    lines.push({
      isActive: true,
      code: '350',
      date: new Date(),
      value: grossValue * 3 / 100,
      debit: false,
      quantity: 1,
      baseValuePeriod: salaryPackage?.baseValuePeriod,
      descriptions: 'INSS [3%]'
    })

    const IRTTable = [
      { a: 0, b: 70000, v: 0 },
      { a: 70001, b: 150000, v: 10 },
      { a: 150001, b: 300000, v: 16 },
      { a: 300001, b: 500000, v: 19 },
      { a: 500001, b: 1500000, v: 20 },
      { a: 1500001, b: 3000000, v: 24 },
    ]
    const IRTpercent = (r: number): number => IRTTable.find(({ a, b }: any) => r > a && r <= b)?.v ?? 0

    if (grossValue > 70000) {
      lines.push({
        isActive: true,
        code: '401',
        date: new Date(),
        value: grossValue * IRTpercent(grossValue) / 100,
        debit: false,
        quantity: 1,
        baseValuePeriod: salaryPackage?.baseValuePeriod,
        descriptions: `IRT [${IRTpercent(grossValue)}%]`
      })
    }

    const deductionValue = lines.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((x: any, y: any) => Number(x) + Number(y));
    const netValue = grossValue - deductionValue;

    const state = {
      base: this.salaryPackage?.baseValue,
      lines,
      grossValue,
      deductionValue,
      netValue
    }

    return state;

  }

  @HasOne(() => SalaryPackage, { as: 'salaryPackage' })
  salaryPackage?: SalaryPackage;

  @HasOne(() => WorkingHour)
  workingHour?: WorkingHour;

  @BeforeCreate
  static beforeDataUpdate = async (contract: Contract) => {
    const employee = await Employee.findByPk(contract?.employeeId, { include: [Contract] });

    let kill: Contract[] | undefined = [];

    const otherContract: Contract[] | undefined = employee?.contracts?.filter(({ id }: any) => id !== contract?.id)
    if (otherContract?.length ?? 0 > 0) {
      kill = otherContract?.filter((c: Contract) =>
        moment(c.endDate).isAfter(contract?.startDate)
      )

      kill = kill?.filter(
        (c: Contract) =>
          moment(c.startDate).isSameOrBefore(contract?.startDate)
      )

      kill?.forEach((c: Contract) => {
        if (!moment().isBetween(c.startDate, c.endDate))
          c.isActive = false;

        c.endDate = moment(contract?.startDate).add(-1, 'days').toDate();
        c.save()
      })

      kill = otherContract?.filter((c: Contract) =>
        moment(contract.endDate).isAfter(c?.startDate)
      )

      kill = kill?.filter((c: Contract) =>
        moment(contract.startDate).isAfter(c?.startDate)
      )

      kill?.forEach((c: Contract) => {
        if (!moment().isBetween(c.startDate, c.endDate))
          c.isActive = false;

        c.endDate = moment(contract?.startDate).add(-1, 'days').toDate();
        c.save()
      })

    }

    if (employee?.contracts?.length === 1) {
      const isActive = moment().
        isBetween(contract?.startDate, contract?.endDate || moment().add(1, 'days'))
      contract.isActive = isActive;

    }
  }
}



