
import {
    Table,
    Column,
    DataType,
    BeforeCreate,
} from "sequelize-typescript";

import { Model } from "../index";

const minValue=35000;
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

    @Column({
        type: DataType.DECIMAL(32,2),
        allowNull: true,
    })
    baseValue!: number;

    @BeforeCreate
    static initializer=(level:RoleLevel)=>
        level.baseValue=(level.no*10350)+(level.no*level.no*8000)+minValue    
}