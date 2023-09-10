
import { Column, DataType, Table, Scopes, HasMany } from "sequelize-typescript"
import { AccountPaymentData, Model } from "../index"

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

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    country?: string;

    @HasMany(() => AccountPaymentData)
    accounts?: AccountPaymentData[];
}