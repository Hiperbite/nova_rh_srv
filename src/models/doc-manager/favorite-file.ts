import { Transaction } from 'sequelize';
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
} from "sequelize-typescript";

import { Model, File } from "../index";

@Scopes(() => ({
  default: {
    include: []
  },

}))
@Table({
  timestamps: true,
  tableName: "FavoriteFiles",
})
export default class FavoriteFile extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @BelongsTo(() => File)
  file?: File;

  @ForeignKey(() => File)
  fileId?: string;

}