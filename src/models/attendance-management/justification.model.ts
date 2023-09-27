import {
    Table,
    Column,
    DataType,
    Scopes,
    HasMany,
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
    name?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    code!: string;

    @HasMany(() => Attendance)
    attendances!: Attendance[]
}
