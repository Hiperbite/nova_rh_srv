import {
    Table,
    Column,
    DataType,
  } from "sequelize-typescript";
  
  import {  Model } from "../index";
  
  @Table({
    timestamps: true,
    tableName: "Payrolls",
  })
  export default class Payroll extends Model {
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    name?: string;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    descriptions?: string;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    level?: string;

  }