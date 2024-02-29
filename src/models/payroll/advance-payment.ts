import { employeeSchema } from './../../application/schema/common/attach-file.schema';

import { includes } from "lodash";
import moment from "moment";
import { Op } from "sequelize";
import {
    Table,
    Column,
    DataType,
    Scopes,
    BeforeCreate,
    BelongsTo,
    ForeignKey,
    HasMany,
    BeforeSave,
} from "sequelize-typescript";
import { AdditionalPayment, AdditionalPaymentType, Employee, Model, PayrollLine, PayStub } from "../index";

@Scopes(() => ({
    all: {
        include: [PayrollLine]
    }
}))
@Table({
    timestamps: true,
    tableName: "AdvancePayments",
})
export default class AdvancePayment extends Model {

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: false,
    })
    amount!: number;

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: true,
    })
    amountPerInstallment?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    numberOfInstallments!: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    startDate!: Date;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        defaultValue: new Date(),
    })
    date!: Date;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    endDate?: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @BelongsTo(() => Employee)
    employee!: Employee

    @ForeignKey(() => Employee)
    employeeId!: string

    @HasMany(() => PayrollLine)
    payrollLines?: PayrollLine[]

    @BeforeCreate
    @BeforeSave
    static beforePaymentCreate = async (payment: AdvancePayment/*, { transaction }: any*/) => {
        payment.amountPerInstallment
            = payment.amount
            / payment.numberOfInstallments;

        payment.endDate
            = moment(payment.startDate)
                .add(payment.numberOfInstallments - 1, 'month')
                .toDate();


        /* let additionalPaymentDatas: any[] = []
 
         let additionalPaymentType = await AdditionalPaymentType.findByPk('53f8b609-21f2-4f53-99df-4db73100a52e')
         for (let i = 0; i < payment.numberOfInstallments; i++) {
             additionalPaymentDatas.push({
 
                 code: additionalPaymentType?.code,
 
                 date: moment(payment.startDate).clone().add(i +, 'months').toDate(),
 
                 value: payment.amountPerInstallment,
 
                 debit: true,
 
                 quantity: 1,
 
                 baseValuePeriod: 1,
 
                 descriptions: additionalPaymentType?.descriptions,
 
                 typeId: additionalPaymentType?.id,
 
             })
         }
         AdditionalPayment.bulkCreate(additionalPaymentDatas, { transaction })*/
    }


}