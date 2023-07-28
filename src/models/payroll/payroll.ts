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
    date?: date;

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

    @BeforeCreate
    @BeforeSave
    static initModel = async (payroll: Payroll) => {

        //let code = await SequenceApp.count(CODES.Payroll);
        // Payroll.code = 'EVT' + String(code).padStart(8, '0');

        /***
         * GENERATE LINES
         */
        let lines: PayrollLine[] =


            payroll?.
                contract?.
                additionalPayments?.
                filter(({ startDate }: any) => moment() <= moment(startDate))
                .map((
                                {
                                    descriptions,

                                    startDate,

                                    baseValue,

                                    baseValuePeriod,

                                    typeId
                                }: any
                            ) => {
                                descriptions,

                                 startDate,

                                baseValue,

                                baseValuePeriod,

                                typeId
                            })

            lines.push({
                                code: 'string'
    
                date: new Date(),

                                value: 'number'    
            
                debit: true,

                                quantity: 1;

                                baseValuePeriod: 2,

                                descriptions: ''
            
                typeId: 'AdditionalPaymentType;',

                            })
    }
}