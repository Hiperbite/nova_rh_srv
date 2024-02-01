
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
    tableName: "RoleModules",
})

export default class RoleModule extends Main {
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
        type: DataType.STRING,
        allowNull: true,
    })
    code!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name!: string;

    @ForeignKey(() => Role)
    roleId!: string;

    @BeforeCreate
    static prepare = (model: RoleModule) => {
        model.isActive ||= true;
        model.id = model.id ?? uuids4();
    };

}