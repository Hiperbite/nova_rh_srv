
import { Request, Response } from "express";
import { Paginate } from "repository/repository";
import { Sequelize } from "sequelize";
import { Frequency, Contract, User, Employee } from "../../models/index";

import Api from "../Api";

class FrequencyApi extends Api<Frequency> {
  constructor() { super(Frequency) }

  /**
   * @param req 
   * @param res 
   * @returns Promise<Response>;
   */
  createFromFile = async (req: Request, res: Response): Promise<Response> => {

    let frequencies: any[] = [];

    const { body: sources } = req;

    for (let source of sources) {

      const { code, date, time, status, uid }: any = source;

      const employee = await Employee.findOne({ where: { code }, include: { all: true } });
      if (employee) {
        let frequency: Frequency | void, message: any[] = [];
        try {

          frequency = await this.repo.createOne(
            {
              uid,
              contractId: employee?.contract?.id,
              date,
              time,
              type: status,
              state: status
            });

        } catch (e: any) {
          message = e?.errors?.map(({ message }: any) => message)
        }

        frequencies.push({ uid, source, status: message?.length > 0 ? 1 : 2, frequency, message })

      } else {
        frequencies.push({ uid, status: 0, source, frequency: null, message: [ 'Employee not found' ] })
      }



    }

    return res.json(frequencies);

  };

}

export default new FrequencyApi();

export { FrequencyApi };
