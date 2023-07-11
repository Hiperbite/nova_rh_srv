import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";

import { Model, RoleLevel as Level, Department as Dep } from "../index";


@Scopes(() => ({
  default: {
    include: [{as: 'department',model:Dep}, {as:'childs',model:Dep}]
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
    unique:true,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  no?: number;

  @HasMany(()=>Dep)
  childs?:Dep[];

  @BelongsTo(() => Dep)
  department?: Dep;
  
  @ForeignKey(() => Dep)
  departmentId?: string;
}
