import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import { AttendanceJustification, AttendanceType, Employee, Model } from "../index";

@Scopes(() => ({

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
        type: DataType.DATE,
        allowNull: true
    })
    endDate!: string;

    @BelongsTo(() => AttendanceType)
    type!: AttendanceType
  
    @ForeignKey(() => AttendanceType)
    typeId!: string;

    @BelongsTo(() => AttendanceJustification)
    justifications!: AttendanceJustification[]
  
    @ForeignKey(() => AttendanceJustification)
    justificationId!: string;

    @BelongsTo(() => Employee)
    employee!: Employee
  
    @ForeignKey(() => Employee)
    employeeId!: string;

    @BelongsTo(() => Employee)
    approver!: Employee
  
    @ForeignKey(() => Employee)
    approverId!: string;
}
