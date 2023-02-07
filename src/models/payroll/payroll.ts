import {
    Table,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  
  import {  Employee, Model } from "../index";
  
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

    @ForeignKey(() => Employee)
    employeeId?: string;
  
    @BelongsTo(() => Employee)
    employee?: Employee;
  }