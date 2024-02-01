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
    simple: {}
}))
@Table({
    timestamps: true,
    tableName: "Holidays",
})
export default class holiday extends Model {

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
        type: DataType.DATEONLY,
        allowNull: false,
    })
    date!: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    currentYear!: boolean;

}