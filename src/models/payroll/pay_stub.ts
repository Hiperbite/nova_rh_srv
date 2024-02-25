import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    BeforeCreate,
    BeforeSave,
    HasMany,
    DefaultScope,
    AfterFind,
    AfterCreate,
} from "sequelize-typescript";
import { Model, Contract, PayrollLine, AccountPaymentData, Payroll, Employee, Person, Department, Role, Category, EmployeeRole, Currency} from "../index";

import PayStubApp from "../../application/payrolls/pay_stub.app";

@DefaultScope(() => ({
    //include: [{ model: Payroll, include: [] },]
}))
@Scopes(() => ({
    default: {
        include: [Payroll, PayrollLine]
    },
    rebuild: {
        include: [Payroll]
    },
    'mine-default': {
        include: [{ model: Payroll, include: [] }, PayrollLine],
    },
    full: {
        include: [{ model: Payroll, include: [] }, PayrollLine,]
    },
    xfull: {
        include: [ { model: Payroll, include: [] }, PayrollLine, { model: Contract, include: [Department, EmployeeRole, Category, { model: Employee, include: [Currency, Person, AccountPaymentData] }] }]
    }
}))
@Table({
    timestamps: true,
    tableName: "PayStubs",
})
export default class PayStub extends Model {
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date?: Date = new Date();

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    month?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    year?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    state?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    get localCurrency() {
        return JSON.parse(this.getDataValue('localCurrency'))
    }
    set localCurrency(c: any) {
        this.setDataValue('localCurrency', JSON.stringify(c))
    }

    @BelongsTo(() => Contract)
    contract!: Contract

    @ForeignKey(() => Contract)
    contractId!: string;

    @BelongsTo(() => Payroll)
    payroll!: Payroll

    @ForeignKey(() => Payroll)
    payrollId!: string;

    @HasMany(() => PayrollLine)
    lines?: PayrollLine[];

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get grossValue() {
        return this.lines?.filter(({ debit }: any) => debit).map(({ value }: any) => Number(value)).reduce((a: number, b: number) => a + b, 0)
    }

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get deductionValue() {
        return this.lines?.filter(({ debit }: any) => !debit).map(({ value }: any) => Number(value)).reduce((a: number, b: number) => a + b, 0)
    };

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get netValue() {
        return (this.grossValue ?? 0) - (this.deductionValue ?? 0);
    }

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get proposal() {
        //  this.lines = this.contract?.payStubState.lines?.map((line: any) => new PayrollLine(line));

        return;// this.contract?.payStubState
    }

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get proposalLines() {
        //return [];


        return;// this.lines = [];
    }

    @AfterFind
    static rebuildPayStubs = async (payStubs: any, opts: any) => {

        if (opts?.topModel?._scopeNames?.indexOf('rebuild') > -1) {
            for (let payStub of payStubs) {
                payStub.lines = await PayrollLine.findAll({ where: { payStubId: payStub.id } })
            }
        }
        return payStubs;
    }
    @AfterCreate
    static afterCreatePayStub = PayStubApp.afterCreatePayStub

    @BeforeCreate
    @BeforeSave
    static initModel = async (payStub: PayStub) => {
        if (!payStub.isNewRecord) return true;
        const { month, year, contractId } = payStub
        const existPayStub = await PayStub.findOne({ where: { month, year, contractId } });
        /**
         * TODO: FIX THIS PEACE OF CODE
         */
        if (existPayStub)
            throw { existPayStub }

    }
}