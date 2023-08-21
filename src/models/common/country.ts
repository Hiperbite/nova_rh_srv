import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    HasMany,
} from "sequelize-typescript";

import { Address, Model } from "../index";

@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "Countries",
})
export default class Country extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    code!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    originalName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    nationality!: string;

    @HasMany(() => Address)
    address?: Address[]


}