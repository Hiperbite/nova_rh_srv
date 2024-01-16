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
    BeforeUpdate,
} from "sequelize-typescript";
import moment from "moment";
import { AdditionalPaymentType, Model, Payroll, PayStub } from "../index";

import SequenceApp, { CODES } from "../../application/common/sequence.app";
import PayStubLineApp from "../../application/payrolls/pay_stub_line.app";

@Scopes(() => ({
    default: {
        include: [AdditionalPaymentType],
        order: ['code']
    }
}))
@Table({
    timestamps: true,
    tableName: "PayrollLines",
})
export default class PayrollLine extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    code!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date?: Date;

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: true,
    })
    get value() {
        return parseFloat(this.getDataValue('value'))
    };

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    debit!: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    quantity?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    baseValuePeriod?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @BelongsTo(() => AdditionalPaymentType)
    type?: AdditionalPaymentType;

    @ForeignKey(() => AdditionalPaymentType)
    typeId?: string;

    @BelongsTo(() => PayStub, {
        foreignKey: {
            allowNull: false
        },
    })
    payStub!: PayStub

    @ForeignKey(() => PayStub)
    payStubId!: string;


    @BeforeUpdate
    @BeforeCreate
    static updatePayStub = PayStubLineApp.updatePayStub
}