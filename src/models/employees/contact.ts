import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasOne,
  DefaultScope,
} from "sequelize-typescript";

import { Employee, Model, Company, ContactType } from "../index";
import { includes } from "lodash";

@DefaultScope(() => ({
  include: [ContactType],
}))
@Scopes(() => ({
  default: {
    include: [],
  },
}))
@Table({
  timestamps: true,
  tableName: "Contacts",
})
export default class Contact extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  descriptions!: string;

  @BelongsTo(() => ContactType)
  type?: ContactType;

  @ForeignKey(() => ContactType)
  typeId?: string;

  @BelongsTo(() => Employee)
  employee?: Employee;

  @ForeignKey(() => Employee)
  employeeId?: string;

  @BelongsTo(() => Company)
  company?: Company;

  @ForeignKey(() => Company)
  companyId?: string;
}
