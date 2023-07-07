import { Request, Response } from "express";
import { Op } from "sequelize";
import { Person, Track, User } from "../../models/index";
import { DefaultRepository as Repository } from "../../repository/index";
import IRepository from "../../repository/iRepository";
import { Paginate } from "../../repository/repository";
import Api from "../Api";
interface IApi {
  create(req: Request, res: Response): Response;
  update(req: Request, res: Response): Response;
  find(req: Request, res: Response): Response;
  findBy(req: Request, res: Response): Response;
}
class TrackApi extends Api<Track>{
  constructor() { super(Track)};

  findBy = async (req: Request, res: Response): Promise<Response> => {
    const include = [{ model: User, include: Person }];
    let where: any = req?.query?.where;

    if (where?.model)
      where.
        model = {
        [Op.in]: where?.model.split(',')
      }

    if (where?.ref)
      where.
        ref = {
        [Op.in]: where?.ref?.split(',')
      }

    const tracks: Paginate<Track> | any =
      await this.repo.paginate({ ...req.query, where: { ...where }, include });
    return res.json(tracks);
  };
}

export default new TrackApi();
export { TrackApi };
