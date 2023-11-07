import {
  Table,
  Column,
  DataType,
  Scopes,
} from "sequelize-typescript";

import { Model } from "../index";

@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "EmployeeCategories",
})
export default class Category extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  no?: number;
}

