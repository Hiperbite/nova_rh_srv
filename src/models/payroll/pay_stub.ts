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
import moment from "moment";
import { Model, Contract, PayrollLine, SalaryPackage, Payroll, Employee, Person, Department, Role } from "../index";
import { payrollState } from "./payroll";
import WITaxApp from "../../application/payrolls/wi_tax.app";
import PayStubApp from "../../application/payrolls/pay_stub.app";

@DefaultScope(() => ({
    //include: [{ model: Payroll, include: [] },]
}))
@Scopes(() => ({
    default: {
        include: [{ model: Payroll, include: [] }, PayrollLine]
    },
    'mine-default': {
        include: [{ model: Payroll, include: [] }, PayrollLine],
    },
    full: {
        include: [{ model: Payroll, include: [] }, PayrollLine,]
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