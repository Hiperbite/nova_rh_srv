
import { Currency } from "../../models/index";
import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
  ForeignKey,
  Scopes
} from "sequelize-typescript";
import { includes } from "lodash";

@Scopes(() => ({
  default: {
    include: [Currency]
  }
}))

@Table({
  timestamps: true,
  tableName: "PayrollSettings",
})
export default class PayrollSetting extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  paymentDay?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  absenceCount?: boolean;

  @Column({
    type: DataType.DECIMAL(32, 2),
    allowNull: true,
  })
  absencePercent?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  overtimeCount?: boolean;

  @Column({
    type: DataType.DECIMAL(32, 2),
    allowNull: true,
  })
  overtimePercent?: number;

  @BelongsTo(() => Currency)
  salaryProcessingCurrency?: Currency;

  @ForeignKey(() => Currency)
  salaryProcessingCurrencyId?: string;

}