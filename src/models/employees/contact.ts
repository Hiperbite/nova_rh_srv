import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    Scopes,
    HasOne,
  } from "sequelize-typescript";
  
  import {  Employee, Model, Company, ContactType } from "../index";
  

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
  
    @BelongsTo(()=>ContactType)
    type?: ContactType;

    @ForeignKey(() => ContactType)
    typeId?: string;
    
    @BelongsTo(()=>Employee)
    employee?: Employee;

    @ForeignKey(() => Employee)
    employeeId?: string;

    @BelongsTo(() => Company)
    company?: Company

    @ForeignKey(() => Company)
    companyId?: string

  }

  