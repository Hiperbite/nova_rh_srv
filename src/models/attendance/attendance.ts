import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    HasMany,
} from "sequelize-typescript";
import { AttendanceJustification, AttendanceType, Employee, Person, Model } from "../index";

@Scopes(() => ({
    withPerson: {
        include: [
            {
                model: Employee,
                as: "employee",
                include: [{
                    model: Person,
                    attributes: ['id', 'fullName','firstName','lastName']
                }]
            }
        ]
    }
}))
@Table({
    timestamps: true,
    tableName: "Attendances",
})
export default class Attendance extends Model {

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    startDate?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    endDate!: string;

    @BelongsTo(() => AttendanceType)
    type!: AttendanceType
  
    @ForeignKey(() => AttendanceType)
    typeId!: string;

    @HasMany(() => AttendanceJustification)
    justifications?: AttendanceJustification[]
  
    @BelongsTo(() => Employee)
    employee!: Employee
  
    @ForeignKey(() => Employee)
    employeeId!: string;

    @BelongsTo(() => Employee)
    approver!: Employee
  
    @ForeignKey(() => Employee)
    approverId!: string;
}
