
import { Request, Response } from "express";
import IRepository from "../repository/iRepository";
import Repository, { Paginate } from "../repository/repository";
import {
  ModelCtor,
  Model as M,
} from "sequelize-typescript";
import { Transaction } from "sequelize";
import EmployeeRepository from "../repository/employees/employee.repository";
//import {IApi } from "./IApi";


class Api<T extends M> implements IApi {
  //protected repo: any
  constructor(private Model: ModelCtor<M>, protected repo?:any) { 
      this.repo ||= new Repository<M>(this.Model)
    };

  /**
   * @param req 
   * @param res 
   * @returns Promise<Response>;
   */
  create = async (req: Request, res: Response): Promise<Response> => {
       

    const { body } = req;
    
    const model: M | void = await this.repo.createOne(body,{include: { all: true } });
        
    return res.json(model);

  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  update = async (req: Request, res: Response): Promise<Response> => {

    const { body: models, } = req;

    const { id } = req.params;

    const updatedM = await this.repo.updateOne({id,...models})

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

    const model: M | null = await this.repo.findOne(
      id,
      { ...opts, include: { all: true } }
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

    const model: M | undefined = await this.repo.deleteBy(id);

    return res.json(model);
  };

  /**
   * @param req 
   * @param res 
   * @returns 
   */
  findBy = async (req: Request, res: Response): Promise<Response> => {

    const models: Paginate<M> | undefined =
      await this.repo
        .paginate({
          ...req.query,
          include: { all: true }
        });

    return res.json(models);
  };
}

//export default new Api(new Repository(M));
export default Api;

interface IApi {
  create(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  find(req: Request, res: Response): Promise<Response>;
  findBy(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  findBy(req: Request, res: Response): Promise<Response>;
}