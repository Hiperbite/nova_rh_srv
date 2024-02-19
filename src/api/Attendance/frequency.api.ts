
import { Request, Response } from "express";
import { Paginate } from "repository/repository";
import { Sequelize } from "sequelize";
import { Frequency, Contract, User } from "../../models/index";

import Api from "../Api";

class FrequencyApi extends Api<Frequency> {
  constructor() { super(Frequency) }


  /**
   * @param req 
   * @param res 
   * @returns 
   */
  findBy = async (req: Request, res: Response): Promise<Response> => {

    const { include } = req.query
    const models: Paginate<Frequency> | undefined =
      await this.repo
        .paginate({

          attributes: [
            [Sequelize.literal(`DATE("createdAt")`), 'date'],
            [Sequelize.literal(`COUNT(*)`), 'count']
          ],
          group: ['date'],
          include,
          ...req.query,
        });

    return res.json(models);
  };

  closeContract = async (req: Request, res: Response): Promise<Response> => {
    const message = "Usuário desabilitado com Sucesso";
    const { id } = req.params;

    await Contract.update({ isActive: false }, { where: { frequencyId: id, isActive: true } });

    await Frequency.update({ isActive: false }, { where: { id: id }, returning: true });

    await User.update({ isActive: false }, { where: { frequencyId: id } });

    return res.status(200).json(message);
  }
}

export default new FrequencyApi();

export { FrequencyApi };
