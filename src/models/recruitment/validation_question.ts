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
    
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import { Contract, Model, PayStub, Requirement } from "../index";
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
    tableName: "ValidationQuestions",
})

export default class ValidationQuestion extends Model{
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    question?: string;
    
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    no?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    points?: number;
    
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    type?: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    idealAnswer?: string;
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    optionsAnswer?: string;
    
    @BelongsTo(() => Requirement)
    requirement?: Requirement;
  
    @ForeignKey(() => Requirement)
    requirementId?: string;
}