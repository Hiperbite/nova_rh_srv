
import {
    Table,
    Column,
    DataType,
} from "sequelize-typescript";

import { Model } from "../index";

@Table({
    timestamps: true,
    tableName: "RoleLevels",
})
export default class RoleLevel extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    no!: number;
}