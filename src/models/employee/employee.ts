
import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    HasMany,
    BeforeCreate,
    BeforeSave,
} from "sequelize-typescript";
import User from "../common/user";
import { Contact, Model, Address, Role, Category, Department, Attachment, Payroll } from "./../index";
import { uuid } from "uuidv4";

@Table({
    timestamps: true,
    tableName: "Employees",
})
export default class Employee extends Model {
    @Column({
        type: DataType.STRING,
   //     allowNull: false,
    })
    code!: string;

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
    })
    otherNames?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    birthDate?: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nationality!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    idcard!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    passPortNumber!: string;

    @HasMany(() => Contact)
    contacts!: Contact[];

    @HasMany(() => Address)
    address?: Address[];

    @ForeignKey(() => User)
    userId?: string;

    @BelongsTo(() => User)
    user?: User;

    @ForeignKey(() => Role)
    roleId?: string;

    @BelongsTo(() => Role)
    role?: Role;

    @ForeignKey(() => Category)
    categoryId?: string;

    @BelongsTo(() => Category)
    category?: Category;

    @ForeignKey(() => Department)
    departmentId?: string;

    @BelongsTo(() => Department)
    department?: Department;
    
    @HasMany(() => Attachment)
    attachments?: Attachment[]

    @HasMany(() => Payroll)
    payrolls?: Payroll[]

    @BeforeCreate
    @BeforeSave
    static setCode = (employee: Employee) => {
        if (employee.code === undefined)
            employee.code = uuid().substring(0, 8).toUpperCase()
    }
}