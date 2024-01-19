import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BeforeCreate,
  Model,
  Scopes,
  BelongsTo,
} from "sequelize-typescript";
import { v4 as uuids4 } from "uuid";

import { RoleModule, User } from "../../index";

@Scopes(() => ({
  full: {
    include: [
      { model: RoleModule }],
  }
}))
@Table({
  timestamps: true,
  tableName: "Roles",
  indexes: [
    {
      unique: true,
      fields: ['userId', 'roleModuleId'],
      name: 'idx_user_role_combined',
    }
  ]
})
export default class Role extends Model {

  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id?: string

  @Column({
    type: DataType.BOOLEAN,
  })
  isActive!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  level!: string;

  @BelongsTo(() => User)
  user!: User

  @ForeignKey(() => User)
  userId!: string;

  @BelongsTo(() => RoleModule)
  RoleModule!: RoleModule

  @ForeignKey(() => RoleModule)
  roleModuleId!: string;

  @BeforeCreate
  static prepare = (model: Role) => {
    model.isActive ||= true;
    model.id = model.id ?? uuids4();
  };
}
