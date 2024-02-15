
import {
    Table,
    Column,
    DataType,
    Scopes,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import {
    Model,
    PayStub,
    Vacancy,
    VacancyProcess,
    SelectionProcess,
    Employee,
    Candidacy
} from "../index";

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
    tableName: "CandidacyProcess",
})
export default class CandidacyProcess extends Model {

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    points?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    notes?: string;

    @BelongsTo(() => Employee)
    employee?: Employee;

    @ForeignKey(() => Employee)
    employeeId?: string;

    @BelongsTo(() => Candidacy)
    candidacy?: Candidacy;

    @ForeignKey(() => Candidacy)
    candidacyId?: string;

    @BelongsTo(() => VacancyProcess)
    process?: VacancyProcess;

    @ForeignKey(() => VacancyProcess)
    processId?: string;

}