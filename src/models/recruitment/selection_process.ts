import { includes } from "lodash";
import { Op } from "sequelize";
import {
    Table,
    Column,
    DataType,
    Scopes,
    ForeignKey,
    BelongsTo,
    HasMany
} from "sequelize-typescript";
import { Model, PayStub, Employee, VacancyProcess } from "../index";
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
    tableName: "SelectionProcess",
})
export default class SelectionProcess extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string;

    @HasMany(() => VacancyProcess)
    vacancyProcess?: VacancyProcess[];

}