import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    BeforeCreate,
} from "sequelize-typescript";
import { Attendance, Model } from "../index";

@Scopes(() => ({

}))
@Table({
    timestamps: true,
    tableName: "AttendanceJustifications",
})
export default class AttendanceJustification extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    code!: string;

    @BelongsTo(() => Attendance)
    attendance!: Attendance

    @ForeignKey(() => Attendance)
    attendanceId!: string;

    @BeforeCreate
    static initCodeField = async (justification: AttendanceJustification) => {        
        let code = await AttendanceJustification.count();
        
        justification.code = String(code).padStart(8, '0');

  };
}
