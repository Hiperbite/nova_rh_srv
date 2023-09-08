import {Column, Table, Scopes, DataType, ForeignKey, BelongsTo} from "sequelize-typescript";

import { Model, Employee, Country } from "../index";

@Scopes(() => ({
    default: {
        include: []
    }
}))

@Table({
    timestamps: true,
    tableName: "AccountPaymentDatas",
})

export default class AccountPaymentData extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    iban!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    account_number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    bank_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    currency_counts?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    swift?: string

    @BelongsTo(() => Employee)
    employee?: Employee;

    @ForeignKey(() => Employee)
    employeeId?: Employee;

    @BelongsTo(() => Country)
    country?: Country;

    @ForeignKey(() => Country)
    countryId?: Country;
}