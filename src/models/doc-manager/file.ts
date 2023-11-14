import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasMany,
} from "sequelize-typescript";

import { Model } from "../index";

type FileType = "DIR" | "FILE" | "OTHER"| "SHORTCUT";

@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "Files",
})
export default class File extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type!: FileType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  path?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fileName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  permissions?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;

  @BelongsTo(() => File)
  dir?: File;

  @ForeignKey(() => File)
  dirId?: string;

  @HasMany(() => File)
  files?: File[];

}

export { FileType };
