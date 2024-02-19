import {
    Table,
    Column,
    DataType,
    Scopes,
    DefaultScope,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";

import { Currency, Model, PayStub } from "../index";


@DefaultScope(() => ({

}))
@Scopes(() => ({
    default: {

    }
}))
@Table({
    timestamps: true,
    tableName: "PayStubCurrencies",
})
export default class PayStubCurrency extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: false,
    })
    value!: number;

    @BelongsTo(() => Currency)
    currency?: Currency

    @ForeignKey(() => Currency)
    currencyId?: string

    @BelongsTo(() => PayStub)
    payStub?: PayStub

    @ForeignKey(() => PayStub)
    payStubId?: string
}