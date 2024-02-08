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
import { Candidacy, Contract, Model, PayStub, Vacancy, ValidationQuestion } from "../index";
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
    tableName: "Candidates",
})
export default class Candidate extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    firstName?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    lastName?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    otherName?: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    birthDate?: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    linkedIn?: string;
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    github?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    email?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phoneNumber?: string;


    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    get skills() {
        return this.getDataValue('skills').split(',')
    };
    set skills(s: string[]) {
        this.setDataValue('skills', s?.join(','))
    };
    
    @HasMany(() => Candidacy)
    candidacies?: Candidacy[];
}