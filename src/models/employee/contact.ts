import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
  } from "sequelize-typescript";
  
  import { Employee, Model } from "../index";
  
  @Table({
    timestamps: true,
    tableName: "Contacts",
  })
  export default class Contact extends Model  {
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    descriptions?: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    type?: string;
  
    @ForeignKey(() => Employee)
    employeeId?: string;

    @BelongsTo(() => Employee)
    employee?: Employee;
  }

  