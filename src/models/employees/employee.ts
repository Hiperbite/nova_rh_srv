import { EmployeeApp } from './../../application/employees/employee.app';
import avatar from "../../application/helper/default_avatar";
import moment from "moment";
import {
  Table,
  Column,
  DataType,
  Scopes,
  HasOne,
  HasMany,
  AfterCreate,
  BeforeCreate,
  DefaultScope,
  AfterFind,
} from "sequelize-typescript";
import SequenceApp from "../../application/common/sequence.app";

import {
  Contact,
  Model,
  Document,
  Person,
  User,
  Contract,
  PayStub,
  SalaryPackage,
  AdditionalPayment,
  AdditionalPaymentType,
  AccountPaymentData,
  EmployeeRole,
  Department,
  Attendance,
  AttendanceType
} from "../index";
import { calculateBusinessDays } from '../../helpers/helper';

@DefaultScope(() => ({
  include: []
}))
@Scopes(() => ({
  all: {
    include: [{
      all: true,
    },
    {
      model: Contract, include: [
        EmployeeRole, Department,
        PayStub,
        {
          model: SalaryPackage,
          include: [
            {
              model: AdditionalPayment,
              include: [AdditionalPaymentType]
            }
          ]
        },
      ]
    }

    ]
  },
  payStub: {
    include: [
      {
        model: Contract, include: [
          EmployeeRole, Department,
          PayStub,
          {
            model: SalaryPackage,
            include: [
              {
                model: AdditionalPayment,
                include: [AdditionalPaymentType]
              }
            ]
          },
        ]
      }
    ]
  },
  default: {
    include: [
      Person,
      {
        model: Contract,
        include: [EmployeeRole, Department],
      }
    ]
  },
  attendance: {
    include: [
      Contract,
      {
        model: Attendance,
        include: [AttendanceType]
      },
      Person,
      {
        model: Contract,
        include: [EmployeeRole, Department],
      }
    ]
  }
}))
@Table({
  timestamps: true,
  tableName: "Employees",
})
export default class Employee extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descriptions?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  type?: string;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  avatar?: string | null;

  @HasOne(() => User)
  user?: User

  @HasOne(() => Person)
  person!: Person;

  @HasMany(() => Contact)
  contacts!: Contact[];

  @HasMany(() => AccountPaymentData)
  accounts!: AccountPaymentData[];

  @HasMany(() => Attendance)
  attendances!: Attendance[];

  @Column({
    type: DataType.VIRTUAL
  })
  get contract() {
    let l;
    let c: any = this.contracts
    c = c?.filter(({ isActive }: any) => isActive)
    c = c?.filter(({ endDate, startDate }: any) => moment().isBetween(startDate, endDate ?? moment().add(1, 'years').format('YYYY-MM-DD')) || moment().isBefore(startDate))
    c = c?.
      sort((n: Contract, p: Contract) =>
        moment(n.startDate).isBefore(moment(p.startDate)) ? -1 : 1)[0];

    return c ?? this.contracts?.sort((n: Contract, p: Contract) =>
      moment(n.startDate).isBefore(moment(p.startDate)) ? -1 : 1)[0];;
  }

  @Column({
    type: DataType.VIRTUAL
  })
  get disabled() {
    return !this.contract?.isActive || moment().isAfter(moment(this.contract?.endDate))
  }
  @Column({
    type: DataType.VIRTUAL
  })
  get role() {

    let c: any = this.contract
    return c?.role
  }

  @Column({
    type: DataType.VIRTUAL
  })
  get department() {
    let c: any = this.contract
    return c?.department
  }

  @HasMany(() => Document)
  documents?: Document[];

  @HasMany(() => Contract)
  contracts?: Contract[];

  @Column({
    type: DataType.VIRTUAL,
  })
  level: number = 0;

  @Column({
    type: DataType.VIRTUAL,
  })
  get idCard() {
    return (
      this?.documents
        ?.sort((doc_a: Document, doc_b: Document) =>
          (doc_a?.validationDate ?? 0) > (doc_b?.validationDate ?? 0) ? 0 : 1
        )
        .filter((doc: Document) => doc.type == "IDCARD")[0] ?? {}
    );
  }

  @Column({
    type: DataType.VIRTUAL,
  })
  get passport() {
    return (
      this?.documents
        ?.sort((doc_a: Document, doc_b: Document) =>
          (doc_a?.validationDate ?? 0) > (doc_b?.validationDate ?? 0) ? 0 : 1
        )
        .filter((doc: Document) => doc.type == "PASSPORT")[0] ?? {}
    );
  }

  @Column({
    type: DataType.VIRTUAL
  })
  get holidayBalance() {

    const oldest: Contract | undefined =
      this.contracts?.sort((a: Contract, b: Contract) => moment(a.startDate).isBefore(b.startDate) ? -1 : 1)[0]
    if (oldest === undefined)
      return;

    const attendances = this.attendances?.filter(({ startDate, endDate }: any) => moment().startOf('year').isSameOrBefore(moment(startDate)))

    const vocations = attendances?.
      filter(({ type }: any) => type?.code === 'VACATION')?.
      filter(({ state }: any) => state === 1)


    const nextDays = vocations?.
      filter(({ startDate, endDate }: any) => moment().isSameOrBefore(moment(startDate)))?.
      map(({ startDate, endDate }: any) => calculateBusinessDays(startDate, endDate)?.totalBusinessDays)

    const pastDays = vocations?.
      filter(({ startDate, endDate }: any) => moment().startOf('year').isSameOrAfter(moment(startDate)))?.
      map(({ startDate, endDate }: any) => calculateBusinessDays(startDate, endDate)?.totalBusinessDays)

    const consumed = pastDays?.
      reduce((a: number, b: number) => a + b, 0)

    const planned = nextDays?.
      reduce((a: number, b: number) => a + b, 0)

    const startDate = moment(oldest?.startDate).isBefore(moment().startOf('year')) ? moment().add(-1, 'year').startOf('year') : moment(oldest?.startDate)
    const balance = startDate.diff(moment().startOf('year'), 'months') * 2 * (-1)
    const annualBalance = balance > 22 ? 22 : balance;

    return {

      available: annualBalance - consumed - planned,
      consumed,
      planned,
      annualBalance,
      attendances
    };

  }
  @Column({
    type: DataType.VIRTUAL
  })
  get payStub() {
    /*
        let myPayrolls: any[] = [];
    
        this.contracts?.forEach((contact: Contract) => {
    
          const startDate = moment(contact.startDate);
          let current = startDate.add(1, 'm');
          const newPayroll = new PayStub()
          newPayroll.contract = contact;
          while (current.isBetween(contact.startDate, contact.endDate)) {
    
    
            let currentPayrolls = (contact?.payStubs?.find((p: PayStub) => moment(p?.date).format('Y-M') === current.format('Y-M')) ?? newPayroll)?.proposalLines
    
            const grossValue = 0, deductionValue = 0;
    
            try {
              const grossValue = currentPayrolls?.filter(({ debit }: any) => debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
              const deductionValue = currentPayrolls?.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
    
            } catch (err: any) {
              let u = err;
            }
            myPayrolls.push({
              date: current.format('Y-M'),
              fromDate: current.format('Y-M'),
              toDate: current.format('Y-M'),
              grossValue,
              deductionValue,
              netValue: grossValue - deductionValue,
              payStubs: currentPayrolls,
              state: 0,
            })
            current = current.add(1, 'M');
          }
    
        })
        */
    return;//myPayrolls;

  }

  /**
   * @param employee 
   * @param param1 
   */
  @AfterCreate
  static createUser = async ({ id: employeeId, contacts, avatar, user }: Employee, { transaction }: any) => {

    if (user) {

      return;

    }

    const email = contacts?.find((c: Contact) => c.descriptions?.includes('@'))?.descriptions

    await User.create({
      email,
      avatar,
      username: email?.split('@')[0],
      role: "ROLE_USER",
      employeeId
    }, { transaction });

  }

  @BeforeCreate
  static initModel = async (employee: Employee, { transaction }: any) => {
    if (employee?.code && employee?.code?.indexOf('A') > -1)
      return;

    let code = await SequenceApp.count(Employee.name, { transaction });
    employee.code = String(code).padStart(8, '0');

  };

  @AfterFind
  static fixUserRelationship = async (employee: Employee | Employee[] | any, { transaction }: any) => {
    try {
      employee?.forEach((e: Employee) => e.avatar ||= avatar)
    } catch (e: any) { }

    try {
      if (employee?.id) {

        employee.avatar ||= avatar

        if (!employee?.user) {
          const email = employee?.contacts?.find((c: Contact) => c.type?.code === "EMAIL")?.descriptions

          await User.create({
            email,
            username: email?.split('@')[0],
            role: "ROLE_USER",
            employeeId: employee?.id,
          }, { transaction });
        }
      }
    } catch (e: any) { }

  }

  static filter = EmployeeApp.filter
}

