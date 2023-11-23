import { toDataURL } from "../../routes/hendlers";
import {
    Scopes,
    Table,
    DataType,
    HasMany,
    Column,
    BelongsTo,
    ForeignKey,
    DefaultScope,
    AfterFind
} from "sequelize-typescript";

import { Contact, Address, Model, Business, Country, Payroll } from "../index";

@DefaultScope(() => ({
    include: [{ model: Address, include: [Country] }, Business, Payroll, Contact]
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
        type: DataType.DATEONLY,
        allowNull: true
    })
    startActivityDate?: Date

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

    @Column({
        type: DataType.VIRTUAL
    })
    base64logo?: string;

    @BelongsTo(() => Business)
    business!: Business

    @ForeignKey(() => Business)
    businessId!: string;

    @HasMany(() => Contact)
    contacts?: Contact[];

    @HasMany(() => Payroll)
    payrolls?: Payroll[];

    @HasMany(() => Address)
    address?: Address[];

    @AfterFind
    static initializer = async (company: Company) => {
        if (company?.logos?.includes('http'))
            company.base64logo = await toDataURL(company?.logos)
    }


}