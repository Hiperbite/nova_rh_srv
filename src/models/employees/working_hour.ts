import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
} from "sequelize-typescript";

import { Contract,Model} from "../index";


@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "WorkingHours",
})
export default class WorkingHour extends Model {
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  descriptions?: string;


  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  period!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hours!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  get weekDays() {
    return this.getDataValue('weekDays').split('_')
  };
  set weekDays(w: string[]) {
    this.setDataValue('weekDays', w.join('_'))
  };

  @BelongsTo(() => Contract)
  contract?: Contract;

  @ForeignKey(() => Contract)
  contractId?: string;

}

