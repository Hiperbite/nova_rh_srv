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
import { Contract, Model, PayStub, RequirementQuestion, Vacancy, ValidationQuestion } from "../index";
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
    get requiredSkills() {
        return this.getDataValue('requiredSkills').split('_')
    };
    set requiredSkills(s: string[]) {
        if (s) {
            try {

                this.setDataValue('requiredSkills', typeof s == 'string' ? s : s?.join('_'))
            } catch (error) {
                let u = this;
            }
        }
    };

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    get optionalSkills() {
        return this.getDataValue('optionalSkills').split('_')
    };
    set optionalSkills(s: string[]) {
        if (s) {
            try {

                this.setDataValue('optionalSkills', typeof s == 'string' ? s : s?.join('_'))
            } catch (error) {
                let u = this;
            }
        }
    };

    @HasMany(()=>RequirementQuestion)
    questions?: RequirementQuestion[]

    @BelongsTo(() => Vacancy)
    vacancy?: Vacancy;
  
    @ForeignKey(() => Vacancy)
    vacancyId?: string;
    

}