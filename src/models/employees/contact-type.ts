import { Table, Column, DataType, BeforeCreate, BelongsTo, ForeignKey, AfterUpdate, AfterCreate, HasMany } from "sequelize-typescript";
import { Contact, Model, User } from "../index";

@Table({
  timestamps: true,
  tableName: "ContactTypes",
})
export default class ContactType extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @HasMany(() => Contact)
  contacts?: Contact[]
}