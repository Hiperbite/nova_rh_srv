import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

import { Model, RoleLevel as Level } from "../index";


@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "Branches",
})
export default class Branch extends Model {
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
    unique:true,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  no?: number;

  @BelongsTo(() => Level)
  level?: Level;
  
  @ForeignKey(() => Level)
  levelId?: Level;
}

