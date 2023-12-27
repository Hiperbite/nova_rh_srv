import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsToMany
} from "sequelize-typescript";

import { Model, User } from "../../index";
import Level from "./level";


@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "Roles",
})
export default class Role extends Model {

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

  @BelongsToMany(() => User, () => Level)
  levels!: Level[] 
  
}

