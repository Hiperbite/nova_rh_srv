import { Table, Model, Column, DataType, BeforeCreate, BelongsTo, ForeignKey, AfterUpdate } from "sequelize-typescript";
import Repository from "../../repository/repository";
//import {  , User} from "../index";

@Table({
  timestamps: true,
  tableName: "DocumentTypeSettings",
})
export default class DocumentTypeSetting extends Model{

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  body?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  header?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  footer?: string;


  @Column({
    type: DataType.BOOLEAN,
  })
  isActive!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  updatedBy?: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  updatedById?: string;
}