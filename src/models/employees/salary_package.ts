import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
  HasMany,
  DefaultScope,
} from "sequelize-typescript";

import { AdditionalPayment, Contract, Model, /* RoleLevel as Level */ } from "../index";



@DefaultScope(() => ({
  include: [AdditionalPayment]
}))

@Scopes(() => ({
  default: {
    include: [AdditionalPayment]
  }
}))
@Table({
  timestamps: true,
  tableName: "SalaryPackages",
})
export default class SalaryPackage extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date;

  @Column({
    type: DataType.DECIMAL(32, 2),
    unique: false,

    allowNull: true,
  })
  baseValue!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: false,
  })
  baseValuePeriod!: number;

  @HasMany(() => AdditionalPayment)
  additionalPayments?: AdditionalPayment[]

  @BelongsTo(() => Contract)
  contract?: Contract

  @ForeignKey(() => Contract)
  contractId?: string
}

