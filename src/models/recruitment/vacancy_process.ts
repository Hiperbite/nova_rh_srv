
import {
    Table,
    Column,
    DataType,
    Scopes,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import { Model, PayStub, Vacancy,  SelectionProcess, Employee} from "../index";
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
    tableName: "VacancyProcess",
})
export default class VacancyProcess extends Model {
     
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    no?: number;
     
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description?: string;

    @BelongsTo(() => SelectionProcess)
    selectionProcess?: SelectionProcess;
  
    @ForeignKey(() => SelectionProcess)
    selectionProcessId?: string;

    @BelongsTo(() => Employee)
    employee?: Employee;
  
    @ForeignKey(() => Employee)
    employeeId?: string;

    @BelongsTo(() => Vacancy)
    vacancy?: Vacancy;
  
    @ForeignKey(() => Vacancy)
    vacancyId?: string;
    
}