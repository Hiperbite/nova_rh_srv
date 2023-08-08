import { Transaction } from "sequelize";
import {
  Model as M,
  ModelCtor,
} from "sequelize-typescript";
import sequelize, { Payroll } from "../../models/index";

import R from "../repository";

export default class PayrollRepository extends R<Payroll> {
  constructor(protected t?: Transaction) {

    super(Payroll, t)

    this.repo = sequelize.getRepository(Payroll);

  }

  public createOne = async (data: any, options: any = null): Promise<Payroll | null | any> => {
    try {
      await this.start();

      const employee: Payroll | void = await this.repo.create(data, { ...options, transaction: this.transaction });

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
