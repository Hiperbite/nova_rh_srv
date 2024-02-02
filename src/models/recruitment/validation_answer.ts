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
import { Contract, Model, PayStub, Requirement, Candidacy, ValidationQuestion } from "../index";
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
    tableName: "ValidationAnswers",
})

export default class ValidationAnswer extends Model{
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    answer?: string;
    
    @BelongsTo(() => ValidationQuestion)
    question?: ValidationQuestion;
  
    @ForeignKey(() => ValidationQuestion)
    questionId?: string;
    
    @BelongsTo(() => Candidacy)
    candidacy?: Candidacy;
  
    @ForeignKey(() => Candidacy)
    candidacyId?: string;
}