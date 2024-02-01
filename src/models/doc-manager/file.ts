import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasMany,
  DefaultScope,
} from "sequelize-typescript";

import { Model } from "../index";

type FileType = "DIR" | "FILE" | "OTHER" | "SHORTCUT";

@DefaultScope(() => ({
  order: [
    ['type', 'ASC'],
    ['fileName', 'ASC'],
  ],
}))
@Scopes(() => ({
  default: {
    include: []
  }, trashed:{
    where: {isActive:false}
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

  @HasMany(() => File, { as: 'files' })
  files?: File[];

}

export { FileType };
