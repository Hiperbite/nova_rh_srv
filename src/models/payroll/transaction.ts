import {
    Table,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  
import { Model , TransactionType } from "../index";
  @Table({
    timestamps: true,
    tableName: "Transactions",
  })
  export default class Transaction extends Model {
    @Column({
      type: DataType.DOUBLE,
      allowNull: true,
    })
    value?: string;

    @Column({
      type: DataType.DOUBLE,
      allowNull: true,
    })
    quantity?: number;
  
    @ForeignKey(() => TransactionType)
    transactionTypeId?: string;

    @BelongsTo(() => TransactionType)
    type?: TransactionType;
  }