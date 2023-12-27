
import {
    Table,
    Column,
    DataType,
    ForeignKey,
    BeforeCreate,
    Model as Main,
} from "sequelize-typescript";
import { v4 as uuids4 } from "uuid";

import { User, Role } from "../../index";
@Table({
    timestamps: true,
    tableName: "levels",
})

export default class Level extends Main {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    id?: string

    @Column({
        type: DataType.BOOLEAN,
    })
    isActive!: boolean;


    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    type?: number;

    @ForeignKey(() => User)
    userId!: string;

    @ForeignKey(() => Role)
    roleId!: string;

    @BeforeCreate
    static prepare = (model: Level) => {
        model.isActive ||= true;
        model.id = model.id ?? uuids4();
    };

}