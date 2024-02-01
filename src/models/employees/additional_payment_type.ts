import {
  Table,
  Column,
  DataType,
  Scopes,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

import { Model, /* RoleLevel as Level */ } from "../index";



@Scopes(() => ({
  default: {
    include: []
  }
}))
@Table({
  timestamps: true,
  tableName: "AdditionalPaymentTypes",
})
export default class AdditionalPaymentType extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;

  @Column({
    type: DataType.STRING(64),
    allowNull: true,
    //unique:true
  })
  name!: string;


  /**
   * A
   * B
   * C
   * D -não inside nos IRT e INSS
   */
  @Column({
    type: DataType.STRING(64),
    allowNull: true,
  })
  category?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  type?: number;
}

