import {
  Model as M,
  ModelCtor,
  Repository as Repo,
} from "sequelize-typescript";
import sequelize from "../../models/index";
import IRepository from "../iRepository";

export default class DefaultRepository<T extends M> implements IRepository<T> {

  repo: Repo<T>;
  /**
   * @param Model 
   */
  constructor(private Model: ModelCtor<T>) {
    this.repo = sequelize.getRepository(Model);
  }

  protected t: any;

  /**
   * @returns 
   */
  protected startTransaction = async () => this.t = this.t ?? await sequelize.transaction();

  /**
 * @param param0 
 * @returns 
 */
  private refactorOptions = async ({
    attributes: attr,
    exclude = [],
    include,
  }: any): Promise<any> => {
    const modelAttrs = Object.keys(await this.Model.describe());
    const toArray = (str: any): string[] =>
      typeof str === "string" ? str?.split(",") : str;
    const attributes = toArray(attr ?? "")
      .filter((x: string) => toArray(modelAttrs).indexOf(x) !== -1)
      .filter((x: string) => toArray(exclude).indexOf(x) === -1);

    return {
      include,
      attributes: attributes.length === 0 ? null : attributes,
      exclude,
    };
  };

  /**
 * @param id 
 * @param opts 
 * @returns 
 */
  public one = async (id: string, opts: any = {}): Promise<T | null> => {

    const options = await this.refactorOptions(opts);

    const data = await this.Model.scope(opts?.scope ?? 'default').findByPk(id, options);

    if (data === null) {
      throw { code: 404, message: "Record not found" }
    }

    return data;

  };

  /**
   * @param data 
   * @param options 
   * @returns 
   */
  public create = async (data: any, options: any = {}): Promise<T | undefined | any> => {

    return await this.Model.create(data, options);

  };

  /**
   * @param data 
   * @param opts 
   * @returns 
   */
  public update = async (data: any, opts: any = {}): Promise<T> => {

    const { ["id"]: _, ...d } = data;
    const { id } = data;

    const model = await this.Model.findByPk(id);

    if (model === null) {
      throw { code: 400, message: 'Record not found to update' }
    }

    return await model?.update(d, { ...opts });

  };

  /**
   * @param id 
   * @returns 
   */
  public delete = async (id: any | string): Promise<boolean> => {

    const model = await this.Model.destroy({
      where: { id }
    });

    return model == 1;

  };

  /**
   * @param options 
   * @returns 
   */
  public oneBy = async (options: any): Promise<any> => {

    const data: M | null = await this.Model.findOne(options);

    if (data === null) {
      throw { code: 404, message: "Record not found" }
    }

    return data;

  };

  /**
   * @param options 
   * @returns 
   */
  public all = async (options: any): Promise<T[] | any> => {

    const { where, include, attributes, limit = 6, offset = 0 } = options;

    const data: T[] = await this.Model.findAll({
      where,
      include,
      attributes,
      offset,
      limit,
    });
    return data;
  };

  /**
   */
  public allBy = async (options: any): Promise<T[] | undefined> => {

    const {
      where,
      include,
      attributes,
      limit = 6,
      offset = 0
    } = options;

    return await this.Model.findAll({
      where,
      attributes,
      include,
      offset,
      limit,
    });
  };

  /**
   * @param options 
   * @returns 
   */
  public paginate = async (
    options: any
  ): Promise<Paginate<T> | undefined> => {
    const {
      where,
      attributes: attrs,
      include,
      scope,
      exclude,
      pageSize = 6,
      page = 1,
      order = [["createdAt", "DESC"]],
    } = options;

    const limit = Number(pageSize);

    const offset =
      Number(page) < 1
        ? 0
        : (Number(page) - 1) * limit;

    const attributes = attrs
      ? attrs?.split(",")
        .filter((x: string) => exclude.indexOf(x) === -1)
      : { exclude };

    return new Paginate(
      await this.Model.scope(scope).findAll({
        where,
        attributes,
        include,
        offset,
        limit,
        order,
      }),
      Number(page),
      limit,
      await this.size(options)
    );
  };

  /**
   * @returns 
   */
  public first = async (): Promise<T | null> => {

    const object = await this.Model.findOne({ order: [["createdAt", "DESC"]] });

    return object;
  };

  /**
   * @returns 
   */
  public last = async (): Promise<T | null> => {

    const object = await this.Model.findOne({ order: [["createdAt", "ASC"]] });

    return object;

  };

  /**
   * @param id 
   * @returns 
   */
  public disable = async (
    id: any
  ): Promise<T> =>
    await this.update({ isActive: false, id });

  /**
   * @param id 
   * @returns 
   */
  public enable = async (id: any): Promise<T | undefined | number | any> =>
    await this.update({ isActive: false, id });

  /**
   * @param Model 
   */
  public clear = function (Model: ModelCtor<T>) {
    //  - Delete all the records from the collection
  };

  /**
   * @param options 
   * @returns 
   */
  public size = async (options: any): Promise<number> => {
    const { where } = options;
    return await this.Model.count({ where });
  };

  /**
   * @param className 
   * @returns 
   */
  public classOf = (className: string) => eval(className);

  /**
   * @param options 
   * @returns 
   */
  paginated = async (
    options: any
  ): Promise<Paginate<T> | undefined> => this.paginate(options)
}

export class Paginate<T> {
  public pages: number = 0;
  public message: string[] = [];
  constructor(
    public data: T[],
    public page: number,
    public pageSize: number,
    public total: number
  ) {
    this.pages = roundUp(this.total / this.pageSize);

    if (1 > this.page) {
      this.message.push(`page ${this.page} doesn't exist, replaced with ${1}`);
      this.page = 1;
    }
    if (this.page > this.pages) {
      this.message.push(
        `page ${this.page} doesn't exist, replaced with ${this.pages}`
      );
      this.page = this.pages;
    }
  }
}
/**
 * TODO: find a better place to put this
 * @param num 
 * @param precision 
 * @returns 
 */
function roundUp(num: number, precision: number = 0) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

