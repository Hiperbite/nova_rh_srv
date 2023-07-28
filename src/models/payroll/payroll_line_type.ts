import {
    Table,
    Column,
    DataType,
    Scopes,
    BelongsTo,
    ForeignKey,
    BeforeCreate,
    BeforeSave,
    HasMany,
} from "sequelize-typescript";
import moment from "moment";
import { Model, PayrollType, PayrollSchedule } from "../index";

import SequenceApp, { CODES } from "../../application/common/sequence.app";

@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "PayrollLineTypes",
})
export default class PayrollLineType extends Model {
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    code!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    date?: Date;
    
    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    debit!: boolean;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name?: string;


}