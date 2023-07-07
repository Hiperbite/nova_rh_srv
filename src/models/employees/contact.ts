import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    Scopes,
    HasOne,
  } from "sequelize-typescript";
  
  import {  Employee, Model, Person } from "../index";
  

@Scopes(() => ({
  default: {
      include: []
  }
}))
  @Table({
    timestamps: true,
    tableName: "Contacts",
  })
  export default class Contact extends Model  {
    @Column({
      type: DataType.STRING(100),
      allowNull: true,
    })
    descriptions?: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    type?: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    postalCode?: string;
  
    @BelongsTo(()=>Employee)
    employee?: Employee;

    @ForeignKey(() => Employee)
    employeeId?: string;

  }

  