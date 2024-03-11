import { Column, Table, Scopes, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

import { Model, Employee, Country, Bank } from "../index";


@Scopes(() => ({
    default: {
        include: [{ model: Bank, include: [Country] }, Country]
    },
    full: {
        include: [{ model: Bank, include: [Country] }, Country]
    }
}))

@Table({
    timestamps: true,
    tableName: "AccountPaymentDatas",
})

export default class AccountPaymentData extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    iban!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    currency?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    swift?: string

    @BelongsTo(() => Employee)
    employee?: Employee;

    @ForeignKey(() => Employee)
    employeeId?: Employee;

    @BelongsTo(() => Bank)
    bank?: Bank;

    @ForeignKey(() => Bank)
    bankId?: Bank;

    @BelongsTo(() => Country)
    country?: Country;

    @ForeignKey(() => Country)
    countryId?: Country;
}