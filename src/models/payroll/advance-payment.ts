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


    }


}