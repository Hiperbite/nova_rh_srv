import { includes } from "lodash";
import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    HasMany,
    DefaultScope,
} from "sequelize-typescript";

import { Address, Business, Model } from "../index";


@Table({
    timestamps: true,
    tableName: "Countries",
})
export default class Country extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    originalName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nationality!: string;

    @HasMany(() => Address)
    address?: Address[]


}