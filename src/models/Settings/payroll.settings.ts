import { Table, Column, DataType, BeforeCreate, BelongsTo, ForeignKey, AfterUpdate } from "sequelize-typescript";
import Repository from "../../repository/repository";
import { Company, Model, User } from "../index";

@Table({
  timestamps: true,
  tableName: "PayrollSettings",
})
export default class PayrollSetting extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  period?: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  startDate?: Date;

  @BelongsTo(() => Company)
  company?: Company

  @ForeignKey(() => Company)
  companyId?: string

}