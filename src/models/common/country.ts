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

import { Address, Bank, Business, Model } from "../index";


@Scopes(() => ({
    simple: {   }
}))
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
    get nationality() {
        const str = this.getDataValue('nationality');
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    };

    @HasMany(() => Bank)
    banks?: Bank[]

    @HasMany(() => Address)
    address?: Address[]


}