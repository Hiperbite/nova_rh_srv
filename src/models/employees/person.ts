
import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  DefaultScope,
  Scopes,
  BeforeCreate,
} from "sequelize-typescript";
import { Address, Contact, Country, Document, Employee, Model } from "../index";


export type MaritalstatusType =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "OTHER";
export type GenderType =
  | "M"
  | "W";

@DefaultScope(() => ({
  include: [
    Country,
    { model: Address, as: 'birthPlaceAddress' },
    { model: Address, as: 'livingAddress' }],
}))
@Scopes(() => ({
  full: {
    include: [
      { model: Address, as: 'birthPlaceAddress' },
      { model: Address, as: 'livingAddress' }],
  },
  default: {
    include: [
    ],
  },
  empty: {
    include: [{}],
  },
}))
@Table({
  timestamps: true,
  tableName: "Persons",
})
export default class Person extends Model {
  @Column({
    type: DataType.VIRTUAL,
  })
  get fullName() {
    return this.firstName + " " + (this.otherNames ?? '') + " " + this.lastName
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otherNames?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maritalStatus?: MaritalstatusType;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  birthDate?: Date;


  @Column({
    type: DataType.VIRTUAL,
  })
  get yearsOld() {
    const _birthDate = new Date(this.birthDate ?? '')
    const currentDate = new Date()
    return Math.abs(currentDate.getUTCFullYear() - _birthDate.getUTCFullYear())
  }

  @BelongsTo(() => Country)
  nationality?: Country;

  @ForeignKey(() => Country)
  nationalityId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender!: GenderType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  socialSecurityNumber?: number

  @ForeignKey(() => Address)
  birthPlaceAddressId?: string;

  @BelongsTo(() => Address, { foreignKey: 'birthPlaceAddressId' })
  birthPlaceAddress?: Address

  @ForeignKey(() => Address)
  livingAddressId?: string;

  @BelongsTo(() => Address, { foreignKey: 'livingAddressId' })
  livingAddress?: Address

  @BelongsTo(() => Employee)
  employee?: Employee;

  @ForeignKey(() => Employee)
  employeeId?: string;

  @BeforeCreate
  static initializers = (person: Person) => {
    let y = person;
  }
};

