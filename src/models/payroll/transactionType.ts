import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    HasMany,
  } from "sequelize-typescript";
  
  import {  Model } from "../index";
  
  @Table({
    timestamps: true,
    tableName: "TransactionTypes",
  })
  export default class TransactionType extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code!: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description?: string;

    @Column({
      type: DataType.DECIMAL,
      allowNull: true,
    })
    defaultValue?: number;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    unit?: string;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    calc?: string;

    @Column({
      type: DataType.BOOLEAN,
      allowNull: true,
    })
    required?: boolean;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    debit!: boolean;

    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    order?: number;

    @ForeignKey(() => TransactionType)
    referenceTypeId?: string;

    @BelongsTo(() => TransactionType)
    reference?: TransactionType;

    @HasMany(() => TransactionType)
    references?: TransactionType
  }