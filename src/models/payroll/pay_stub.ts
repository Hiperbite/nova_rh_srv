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
        include: [{ model: Payroll, include: [] }, PayrollLine, ]
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
    static afterCreatePayStub = async (payStub: PayStub, { transaction }: any = { transaction: null }) => {

        const salaryPackage: any = await SalaryPackage.findOne({ where: { contractId: payStub?.contractId } })// payStub?.contract?.salaryPackage
        const additionalPayments: any = salaryPackage?.additionalPayments

        let lines: any[] =

            additionalPayments?.
                filter(({ isActive }: any) => isActive).
                filter(({ startDate }: any) => moment(payStub?.date).isAfter(moment(startDate))).
                map(({ code, descriptions, startDate, isActive, baseValue, baseValuePeriod, type }: any) => (
                    {
                        isActive,
                        code: type?.code,
                        date: new Date(),
                        descriptions: type?.name,
                        startDate,
                        value: Number(baseValue),
                        property: 1,
                        debit: true,
                        baseValuePeriod,
                        typeId: type?.id
                    }
                )
                ) ?? [];

        try {
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
        } catch (e: any) {

            let u = e;
        }
        if (payStub.contractId === '22ad6154-2eb2-455f-884e-463d72e34792') {
            let u = 0;
        }
        const grossValue: number = lines?.map((x: any) => Number(x?.value))?.reduce((x: any, y: any) => x + y)

        const IRTTable = [
            { a: 0, b: 70000, v: 0 },
            { a: 70001, b: 150000, v: 10 },
            { a: 150001, b: 300000, v: 16 },
            { a: 300001, b: 500000, v: 19 },
            { a: 500001, b: 1500000, v: 20 },
            { a: 1500001, b: 3000000, v: 24 },
        ]
        const IRTpercent = (r: number): number => IRTTable.find(({ a, b }: any) => r > a && r <= b)?.v ?? 0

        const { excess, rate, fixedInstallment, witValue, ssValue } = await WITaxApp.calculator(lines)
        if (grossValue > 70000) {
            lines.push({
                isActive: true,
                code: '401',
                date: new Date(),
                value: witValue,
                debit: false,
                quantity: 1,
                baseValuePeriod: salaryPackage?.baseValuePeriod,
                descriptions: `IRT [${rate}%]`,

            })
        }

        lines.push({
            isActive: true,
            code: '350',
            date: new Date(),
            value: ssValue,
            debit: false,
            quantity: 1,
            baseValuePeriod: salaryPackage?.baseValuePeriod,
            descriptions: 'INSS [3%]'
        })

        const deductionValue = lines.filter(({ debit }: any) => !debit).map((x: any) => x.value).reduce((x: any, y: any) => Number(x) + Number(y));
        const netValue = grossValue - deductionValue;

        for (let line of lines)
            await PayrollLine.create({ ...line, payStubId: payStub?.id }, { transaction })

    }
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