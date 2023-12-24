import { includes } from "lodash";
import { Op } from "sequelize";
import {
    Table,
    Column,
    DataType,
    Scopes,
    HasMany,
    AfterFind,
    AfterUpdate,
    AfterSave,
} from "sequelize-typescript";
import { Contract, Model, PayStub } from "../index";
/**
 * 0 - Aberto
 * 1 - Analise * 
 * 2 - Confirmação
 * 3 - Aprovação
 * 4 - Execução
 */
enum State {
    Opened,
    Validated,
    Confirmed,
    Approved,
    Executed,
}
@Scopes(() => ({
    default: {
        include: [PayStub]
    }
}))
@Table({
    timestamps: true,
    tableName: "WITaxTables",
})
export default class WITaxTable extends Model {
   
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    code?: number;
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    level?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    fromValue?: number;
    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    toValue?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    fixedInstallment?: number;
    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    rate?: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    excess?: number;

    

}