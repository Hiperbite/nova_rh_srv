
import { IApi } from "api/IApi";
import { Request, Response } from "express";
import { Paginate } from "../../repository/common/default.repository";
import PayrollRepository from "../../repository/payroll/payroll.repository";
import { Payroll } from "../../models/index";

import moment from "moment";
import { start } from "repl";
import { payrollState } from "../../models/payroll/payroll";

class PayrollApi {
  repo: PayrollRepository;
  constructor() {
    this.repo = new PayrollRepository()
  };

  /**
   * @param req 
   * @param res 
   * @returns Promise<Response>;
   */
  create = async (req: Request, res: Response): Promise<Response> => {

    const { body } = req;

    const payroll: Payroll | void =
      await this.repo
        .createOne(body, { include: { all: true } });

    return res.json(payroll);

  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  update = async (req: Request, res: Response): Promise<Response> => {

    const { body: models, } = req;

    const { id } = req.params;

    const updatedM = await this.repo.updateOne({ id, ...models })

    return res.json(updatedM);

  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  find = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { query: opts } = req;

    const model: Payroll | null = await this.repo.findOne(
      id,
      { ...opts, scope: 'default' }
    );

    return res.json(model);

  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  delete = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const model: Payroll | any = await this.repo.deleteBy(id);

    return res.json(model);
  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  findBy = async (req: Request, res: Response): Promise<Response> => {

    const models: Paginate<Payroll> | undefined =
      await this.repo
        .paginate({
          ...req.query,
          //      include: { all: true }
        });

    return res.json(models);
  };
}

export default new PayrollApi();

export { PayrollApi };
