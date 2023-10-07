import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    DefaultScope,
} from "sequelize-typescript";

import { Company, Country, Model } from "../index";


@DefaultScope(() => ({
    include: [Country]
}))
@Scopes(() => ({
    default: {
        include: [Country]
    }
}))
@Table({
    timestamps: true,
    tableName: "Address",
})
export default class Address extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city!: string;

    @Column({
        type: DataType.VIRTUAL,
    })
    get fullAddress() {
        return this.descriptions + ', ' +
            this.city + ', ' +
            this.province + ', ' +
            this.country?.name
    }

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    province!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    countryCode?: string;

    @BelongsTo(() => Company)
    company?: Company

    @ForeignKey(() => Company)
    companyId?: string

    @BelongsTo(() => Country)
    country?: Country

    @ForeignKey(() => Country)
    countryId?: string
}