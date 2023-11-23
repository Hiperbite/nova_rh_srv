
import { Column, DataType, Table, Scopes, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript"
import { AccountPaymentData, Country, Model } from "../index"

@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "Banks"
})
export default class Bank extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    code?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    prefix?: string;

    @BelongsTo(()=>Country)
    country?: Country;

    @ForeignKey(()=>Country)
    countryId?: string;

    @HasMany(() => AccountPaymentData)
    accounts?: AccountPaymentData[];
}