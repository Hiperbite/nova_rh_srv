import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
  HasMany,
  DefaultScope,
} from "sequelize-typescript";

import { Model, Department as Dep } from "../index";

/*
@DefaultScope(() => ({
  include: [{ as: 'department', model: Dep }]
}))
*/
@Scopes(() => ({
  default: {
    include: [{ model: Dep , as: 'department'}, {  model: Dep , as: 'childs',}]
  },
  full: {
    include: [{  model: Dep , as: 'department'}, { model: Dep,as: 'childs',  include: [{ model: Dep , as: 'department' }, { model: Dep, as: 'childs' }] }]
  }
}))
@Table({
  timestamps: true,
  tableName: "Departments",
})
export default class Department extends Model {
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

  @HasMany(() => Dep,'departmentId')
  childs?: Dep[];

  @BelongsTo(() => Dep, 'departmentId')
  department?: Dep;

  @ForeignKey(() => Dep)
  departmentId?: string;
}

