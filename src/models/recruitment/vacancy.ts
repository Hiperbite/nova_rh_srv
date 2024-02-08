import { includes } from "lodash";
import { Op } from "sequelize";
import moment from "moment";
import {
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    Scopes,
    HasOne,
    DefaultScope,
    HasMany,
    BeforeCreate,
} from "sequelize-typescript";


import { Model, Requirement, Employee, SalaryPackage, Department, Person, AdditionalField, WorkingHour, PayStub, EmployeeRole, AdditionalPayment, AdditionalPaymentType, User, Category, Candidacy } from "../index";
import SequenceApp from "../../application/common/sequence.app";
/**
 * 0 - Aberto
 * 1 - Analise * 
 * 2 - Confirmação
 * 3 - Aprovação
 * 4 - Execução
 */
enum State {
    Opened,
    Validated,
    Confirmed,
    Approved,
    Executed,
}
@Scopes(() => ({
    default: {
        include: []
    }
}))
@Table({
    timestamps: true,
    tableName: "Vacancies",
})
export default class Vacancy extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    code?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title?: string;


    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    workplaceType?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    descriptions?: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    level?: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    type?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    jobType?: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    endDate?: Date | null;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    startDate!: Date;

    @BelongsTo(() => EmployeeRole)
    role?: EmployeeRole;

    @ForeignKey(() => EmployeeRole)
    roleId?: string;

    @BelongsTo(() => Category)
    category?: Category;

    @ForeignKey(() => Category)
    categoryId?: string;

    @BelongsTo(() => Department)
    department!: Department;

    @ForeignKey(() => Department)
    departmentId!: string;

    @HasOne(() => SalaryPackage, { as: 'salaryPackage' })
    salaryPackage?: SalaryPackage;

    @HasOne(() => WorkingHour)
    workingHour?: WorkingHour;

    @HasOne(() => Requirement)
    requirement?: Requirement;

    @HasMany(() => Candidacy)
    candidacies?: Candidacy[];

    @BeforeCreate
    static initModel = async (vacancy: Vacancy, { transaction }: any) => {
        if (vacancy?.code && vacancy?.code?.indexOf('A') > -1)
            return;

        let code = await SequenceApp.count(Vacancy.name, { transaction });
        vacancy.code = String(code).padStart(8, '0');

    };

}