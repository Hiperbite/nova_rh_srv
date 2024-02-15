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
import { Contract, Model, PayStub, Requirement, ValidationQuestion as _ValidationQuestion, RequirementQuestion as _RequirementQuestion } from "../index";
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
export default class ValidationQuestion extends Model {


    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    no?: number;
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    question!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 1,
    })
    points?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
    })
    type?: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    idealAnswer!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    get optionsAnswer() {
        return this.getDataValue('optionsAnswer')?.split('**')
    }
    set optionsAnswer(answer: string[]) {
        this.setDataValue('optionsAnswer', answer.join('**'));
    };

    @HasMany(() => _RequirementQuestion)
    requirements?: _RequirementQuestion[];
}

@Table({
    timestamps: true,
    tableName: "RequirementQuestions",
})
class RequirementQuestion extends Model {
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

    @BelongsTo(() => Requirement)
    requirement?: Requirement;

    @ForeignKey(() => Requirement)
    requirementId?: string;

    @BelongsTo(() => _ValidationQuestion)
    question?: _ValidationQuestion;

    @ForeignKey(() => _ValidationQuestion)
    questionId?: string;
}

export { RequirementQuestion }