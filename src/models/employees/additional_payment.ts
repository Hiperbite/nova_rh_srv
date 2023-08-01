import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    DefaultScope,
} from "sequelize-typescript";

import { AdditionalPaymentType, Model, /* RoleLevel as Level */ SalaryPackage } from "../index";


@DefaultScope(() => ({
    include: [AdditionalPaymentType]
  }))  
@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "AdditionalPayments",
})
export default class AdditionalPayment extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    startDate?: Date;

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: true,
    })
    baseValue!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    baseValuePeriod!: number;

    @BelongsTo(() => AdditionalPaymentType)
    type?: AdditionalPaymentType;

    @ForeignKey(() => AdditionalPaymentType)
    typeId?: string;

    @BelongsTo(() => SalaryPackage)
    salaryPackage?: SalaryPackage

    @ForeignKey(() => SalaryPackage)
    salaryPackageId?: string
}

