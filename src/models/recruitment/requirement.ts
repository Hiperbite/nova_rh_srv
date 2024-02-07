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
import { Contract, Model, PayStub, Vacancy, ValidationQuestion } from "../index";
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
    tableName: "Requirements",
})
export default class Requirement extends Model {
   
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    _requiredSkills?: string;

    @Column({
        type: DataType.VIRTUAL,
        allowNull: true,
    })
    get requiredSkills(){
        return this.getDataValue('requiredSkills').split(',')
    }
    set requiredSkills(skills:string[]){
        this.setDataValue('requiredSkills',skills.join(','))
    }
    
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    optionalSkills?: string;

    @HasMany(()=>ValidationQuestion)
    questions?: ValidationQuestion[]

    @BelongsTo(() => Vacancy)
    vacancy?: Vacancy;
  
    @ForeignKey(() => Vacancy)
    vacancyId?: string;
    

}