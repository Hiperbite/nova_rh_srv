import {
    Table,
    Column,
    DataType,
    Scopes,
    DefaultScope,
    HasMany,
} from "sequelize-typescript";

import { Model } from "../index";

@DefaultScope(() => ({

}))
@Scopes(() => ({
    default: {

    }
}))
@Table({
    timestamps: true,
    tableName: "Currencies",
})
export default class Currency extends Model {
    @Column({
        type: DataType.STRING(3),
        allowNull: true,
    })
    code?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: false,
    })
    value!: number;
}