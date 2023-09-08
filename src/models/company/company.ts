import {
    Scopes,
    Table,
    DataType,
    HasMany,
    Column,
    BelongsTo,
    ForeignKey,
    DefaultScope
} from "sequelize-typescript";

import { Contact, Address, Model, Business, Country } from "../index";

@DefaultScope(() => ({
    include: [{ model: Address, include: [Country] }, Business]
}))
@Scopes(() => ({
    default: {
        include: [{ model: Address, include: [Country] }, Business]
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
    code?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    description?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    nif?: string

    @Column({
        type: DataType.DECIMAL(32, 2),
        allowNull: true
    })
    socialCapital?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    integrationToken?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    slogan?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    logos?: string;

    @BelongsTo(() => Business)
    business!: Business

    @ForeignKey(() => Business)
    businessId!: string;

    @HasMany(() => Contact)
    contacts?: Contact[];

    @HasMany(() => Address)
    address?: Address[];

}