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
} from "sequelize-typescript";
import moment from "moment";
import { Model, Contract, PayrollLine, SalaryPackage } from "../index";

import SequenceApp, { CODES } from "../../application/common/sequence.app";

@Scopes(() => ({
    default: {
        include: [{ model: Contract, include: [SalaryPackage] }]
    }
}))
@Table({
    timestamps: true,
    tableName: "Payrolls",
})
export default class Payroll extends Model {
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date?: Date;

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

    @HasMany(() => PayrollLine)
    lines?: PayrollLine[];

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get proposalLines() {
        const salaryPackage: any = this?.contract?.salaryPackage
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
            descriptions: '',
            typeId: 'Base',

        })
        additionalPayments?.
            filter(({ isActive }: any) => isActive).
            filter(({ startDate }: any) => moment(this.date).isAfter(moment(startDate))).
            map(({ code, descriptions, startDate, isActive, baseValue, baseValuePeriod, type }: any) => (
                {
                    isActive,
                    code: type?.code,
                    date: new Date(),
                    descriptions,
                    startDate,
                    value: Number(baseValue),
                    property: 1,
                    debit: true,
                    baseValuePeriod,
                    typeId: type.name
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
            descriptions: '',
            typeId: 'INSS [3%]'
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
                descriptions: '',
                typeId: `IRT [${IRTpercent(grossValue)}%]`
            })
        }

        return lines;
    }

    @BeforeCreate
    @BeforeSave
    static initModel = async (payroll: Payroll) => {

        //let code = await SequenceApp.count(CODES.Payroll);
        // Payroll.code = 'EVT' + String(code).padStart(8, '0');

        /***
         * GENERATE LINES
         */

    }
}