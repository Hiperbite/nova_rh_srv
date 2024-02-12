import { Transaction } from 'sequelize';
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Scopes,
  HasMany,
  DefaultScope,
  BeforeCreate,
  BeforeUpdate,
  AfterFind,
} from "sequelize-typescript";

import { FavoriteFile, Model } from "../index";

type FileType = "DIR" | "FILE" | "OTHER" | "SHORTCUT";

@DefaultScope(() => ({
  order: [
    ['type', 'ASC'],
    ['fileName', 'ASC'],

  ],
  include: [FavoriteFile]
}))
@Scopes(() => ({
  default: {
    include: []
  },

  trashed: {
    where: { isActive: false }
  },
  full: {
    include: [{ model: File, 'as': 'dir', include: [{ model: File, 'as': 'dir', include: [{ model: File, 'as': 'dir' }] }] }]
  },


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
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  path?: any;

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


  @HasMany(() => FavoriteFile)
  favorites?: FavoriteFile[];

  @AfterFind
  static fixPath = async (file: File, { transaction }: any) => {
    let fixedFile: any = await File.scope('full').findByPk(file?.dirId);
    if (fixedFile) {

      let path: string[] = [];

      do {
        path.push(fixedFile);
        fixedFile = fixedFile.dir;
      } while (fixedFile)

      file.path = path.reverse();
    }
  }


}

export { FileType };
