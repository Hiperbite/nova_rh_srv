import { includes, orderBy } from "lodash";
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasOne,
  DefaultScope,
} from "sequelize-typescript";

import { Model, Contract } from "../index";

@DefaultScope(() => ({
  include: [],
}))
@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "AdditionalFields",
})
export default class AdditionalField extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  no!: number;

  @BelongsTo(() => Contract)
  contract?: Contract;

  @ForeignKey(() => Contract)
  contractId?: string;
}



