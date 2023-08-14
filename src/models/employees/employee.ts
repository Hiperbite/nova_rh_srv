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
} from "sequelize-typescript";
import SequenceApp from "../../application/common/sequence.app";

import {
  Contact,
  Model,
  Document,
  Person,
  User,
  Contract,
  AdditionalField,
  Role,
  PayStub,
  SalaryPackage,
  AdditionalPayment,
  AdditionalPaymentType,
  AccountPaymentData
} from "../index";

@Scopes(() => ({
  payStub: {
    include: [
      {
        model: Contract, include: [
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
    include: [Person, {
      model: Contract, includes: [AdditionalField,
        Role
      ]
    }]
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

  @HasOne(() => User)
  user?: User

  @HasOne(() => Person)
  person?: Person;

  @HasMany(() => Contact)
  contacts!: Contact[];

  @HasMany(() => AccountPaymentData)
  account_payment_datas!: AccountPaymentData[];

  @Column({
    type: DataType.VIRTUAL
  })
  get currentContract() {
    return this.contracts?.filter(({ isActive }: any) => isActive).
      filter(({ endDate }: any) => moment().isBefore(endDate))[0];
  }

  @Column({
    type: DataType.VIRTUAL
  })
  get role() {

    let c: any = this.contracts
    c = c?.filter(({ isActive }: any) => isActive)
    c = c?.
      filter(({ endDate, startDate }: any) => moment().isBetween(startDate, endDate) || moment().isBefore(startDate))
    c = c?.
      sort((n: Contract, p: Contract) =>
        moment(n.startDate).isBefore(moment(p.startDate)) ? 1 : -1)[0];

    return c?.role
  }

  @Column({
    type: DataType.VIRTUAL
  })
  get department() {
    let c: any = this.contracts
    c = c?.filter(({ isActive }: any) => isActive).
      filter(({ endDate, startDate }: any) => moment().isBetween(startDate, endDate) || moment().isBefore(startDate))
    c = c?.
      sort((n: Contract, p: Contract) =>
        moment(n.startDate).isBefore(moment(p.startDate)) ? 1 : -1)[0];

    return c?.department
  }

  @HasMany(() => Document)
  documents?: Document[];

  @HasMany(() => Contract)
  contracts?: Contract[];

  @Column({
    type: DataType.VIRTUAL,
  })
  avatar?: string

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
  get payStub() {

    let myPayrolls: any[] = [];

    this.contracts?.forEach((contact: Contract) => {

      const startDate = moment(contact.startDate);
      let current = startDate.add(1, 'm');
      const newPayroll = new PayStub()
      newPayroll.contract = contact;
      while (current.isBetween(contact.startDate, contact.endDate)) {

        
        let currentPayrolls = (contact?.payStubs?.find((p: PayStub) => moment(p?.date).format('Y-M') === current.format('Y-M')) ?? newPayroll)?.proposalLines

        const grossValue = currentPayrolls?.filter(({ debit }: any) => debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
        const deductionValue = currentPayrolls?.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((a: number, b: number) => a + b);
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
    return myPayrolls;

  }

  /**
   * @param employee 
   * @param param1 
   */
  @AfterCreate
  static createUser = async ({ id: employeeId, contacts, avatar }: Employee, { transaction }: any) => {

    const email = contacts?.find((c: Contact) => c.type === "EMAIL")?.descriptions

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

    let code = await SequenceApp.count(Employee.name, { transaction });
    employee.code = String(code).padStart(8, '0');

  };
}

