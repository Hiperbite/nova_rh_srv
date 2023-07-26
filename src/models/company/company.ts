import {
    Scopes,
    Table,
    DataType,
    HasMany,
    Column
} from "sequelize-typescript";

import {Contact, Address, Model} from "../index";

@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "Company"
})
export default class Company extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    description?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    business?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    nif?: string

    @Column({
        type: DataType.DECIMAL(32,2),
        allowNull: true
    })
    socialCapital?: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    integrationToken?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    slogan?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    logos?: string;

    @HasMany(() => Contact)
    contacts?: Contact[];

    @HasMany(() => Address)
    address?: Address[];

    
}