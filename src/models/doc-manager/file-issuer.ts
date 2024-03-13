
import {
    Table,
    Column,
    DataType,
    HasMany,
} from "sequelize-typescript";

import {  File, Model } from "../index";


@Table({
    timestamps: true,
    tableName: "FileIssuers",
})
export default class FileIssuer extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    code?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name?: String;

    @HasMany(() => File)
    files?: File[];


}
