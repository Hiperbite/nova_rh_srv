import {
    Table,
    Column,
    DataType,
    Scopes,
    HasOne,
    HasMany,
} from "sequelize-typescript";
import { Attendance, Model } from "../index";

@Scopes(() => ({

}))
@Table({
    timestamps: true,
    tableName: "AttendanceTypes",
})
export default class AttendanceType extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    code!: string;

    @HasMany(() => Attendance)
    attendance?: Attendance[]


}
