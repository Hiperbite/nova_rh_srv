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


import { Model, Requirement, Employee, SalaryPackage, Department, Person, AdditionalField, WorkingHour, PayStub, EmployeeRole, AdditionalPayment, AdditionalPaymentType, User, Category } from "../index";
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
    tableName: "vacancies",
})
export default class Vacancy extends Model {
   
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    code?: number;
    
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
        type: DataType.INTEGER,
        allowNull: true,
      })
      type?: number;
    
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
    
      @BelongsTo(() => Employee)
      employee?: Employee;
    
      @ForeignKey(() => Employee)
      employeeId?: string;
    
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

      
      @HasMany(() => Requirement)
      requirements?: Requirement[];

      
}