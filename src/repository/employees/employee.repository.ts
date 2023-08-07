import { Transaction } from "sequelize";
import {
  Model as M,
  ModelCtor,
} from "sequelize-typescript";
import sequelize, { Employee } from "../../models/index";

import R from "../repository";

export default class EmployeeRepository extends R<Employee> {
  constructor(protected t?: Transaction) {

    super(Employee, t)

    this.repo = sequelize.getRepository(Employee);

  }

  public createOne = async (data: any, options: any = null): Promise<Employee | null | any> => {
    try {
      await this.start();

      const employee: Employee | void = await this.repo.create(data, { ...options, transaction: this.transaction });

      if (employee) {
        await this.commit();
        return employee
      }

    } catch (e: any) {

      await this.rollback();

      throw e

    }

    return;
  };


}
