import {
    Table,
    Column,
    DataType,
  } from "sequelize-typescript";
  
  import {  Model } from "../index";
  
  @Table({
    timestamps: true,
    tableName: "TransactionTypes",
  })
  export default class TransactionType extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name?: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description?: string;

    @Column({
      type: DataType.DOUBLE,
      allowNull: true,
    })
    value?: string;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    unit?: string;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: true,
    })
    debit?: boolean;

  }