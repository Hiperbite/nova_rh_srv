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
import { AdditionalPaymentType, Model, Payroll } from "../index";

import SequenceApp, { CODES } from "../../application/common/sequence.app";

@Scopes(() => ({
    default: {
        include: []
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
        type: DataType.INTEGER,
        allowNull: true,
    })
    value!: number;
    
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

    @BelongsTo(() => Payroll)
    payroll!: Payroll

    @ForeignKey(() => Payroll)
    payrollId!: string;

}