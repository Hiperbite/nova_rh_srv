
import { Request, Response } from "express";
import { Person } from "../../models/index";
import IRepository from "../../repository/iRepository";
import { Paginate } from "../../repository/repository";
import { DefaultRepository as Repository } from "../../repository/index";
interface IApi {
  create(req: Request, res: Response): Response;
  update(req: Request, res: Response): Response;
  find(req: Request, res: Response): Response;
  findBy(req: Request, res: Response): Response;
}
class PersonApi {
  constructor(private repo: IRepository<Person>) { };

  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;

    const model: Person | void = await this.repo.create(body);

    return res.json(model);
  };

  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  update = async (req: Request, res: Response): Promise<Response> => {

    const { body: models, } = req;

    const updatedPerson = await this.repo.update(models)

    return res.json(updatedPerson);

  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  find = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { query: opts } = req;

    const model: Person | null = await this.repo.one(
      id,
      { ...opts, include: { all: true } }
    );

    return res.json(model);

  };
  
  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  delete = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    const model: Person | undefined = await this.repo.delete(id);

    return res.json(model);
  };

  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  findBy = async (req: Request, res: Response): Promise<Response> => {
    
    const models: Paginate<Person> | undefined =
      await this.repo
        .paginated({
          ...req.query,
          include: { all: true }
        });

    return res.json(models);
  };
}

export default new PersonApi(new Repository(Person));
export { PersonApi };
