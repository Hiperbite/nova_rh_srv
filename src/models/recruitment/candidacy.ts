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
import { Contract, Model, PayStub, Vacancy, ValidationAnswer , Candidate} from "../index";
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
    tableName: "Candidacies",
})
export default class Candidacy extends Model {
   
    
    @HasMany(()=>ValidationAnswer)
    questions?: ValidationAnswer[]


    @BelongsTo(() => Vacancy)
    vacancy?: Vacancy;
  
    @ForeignKey(() => Vacancy)
    vacancyId?: string;


    
    @BelongsTo(() => Candidate)
    candidate?: Candidate;
  
    @ForeignKey(() => Candidate)
    candidateId?: string;
}