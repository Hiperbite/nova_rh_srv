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
import { Model, Contract, PayrollLine } from "../index";

import SequenceApp, { CODES } from "../../application/common/sequence.app";

@Scopes(() => ({
    default: {
        include: []
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
        const salaryPackage = this?.contract?.salaryPackage
        const additionalPayments = salaryPackage?.additionalPayments

        let lines: any =
            additionalPayments?.
                filter(({ startDate }: any) => moment().isBefore(startDate)).
                map(({ descriptions, startDate, baseValue, baseValuePeriod, typeId }: any)=> (
                    {
                        code: '',
                        date: new Date(),
                        descriptions, 
                        startDate, 
                        baseValue,
                        property:1,
                        debit: true,
                        baseValuePeriod, 
                        typeId }
                    )
                    )

        lines.push({
            code: 'string',
            date: new Date(),
            value: salaryPackage?.baseValue    ,
            debit: true,
            quantity: 1,
            baseValuePeriod: salaryPackage?.baseValuePeriod,
            descriptions: '',
            typeId: 'AdditionalPaymentType'
        })

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