import { includes } from 'lodash';
import { Transaction } from "sequelize";
import {
  Model as M,
  ModelCtor,
  Repository as Repo,
} from "sequelize-typescript";
import sequelize from "../models/index";

export default class Repository<T extends M>  {
  repo: Repo<T>;
  constructor(private Model: ModelCtor<T>, public transaction?: Transaction) {
    this.repo = sequelize.getRepository(Model);
  }

  protected start = async () => this.transaction = await sequelize.transaction();
  protected commit = async () => await this.transaction?.commit();
  protected rollback = async () => this.transaction?.rollback().catch(console.warn);

  private refactorOptions = async ({
    attributes: attr,
    exclude = "",
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

  public findOne = async (id: string, opts: any = {}): Promise<T | null> => {
    const options = await this.refactorOptions(opts);
    const data = await (
      opts?.scope
        ? this.repo.scope(opts?.scope)
        : this.repo
    ).findByPk(id, options);

    return data;
  };

  public createOne = async (data: any, options: any = null): Promise<T | void> => {

    let final;

    let { include }: any = this?.Model?.options?.scopes?.all ?? {};
    let includes = include ?? options?.include;
    await this.start();
    final = await this.Model.create(data, {
      ... {
        ...options,
        include: includes
      }, transaction: this.transaction
    });
    await this.commit();

    return final;
  };

  public updateOne = async (data: any, options?: any): Promise<T | any> => {
    const { ["id"]: _, ...d } = data;
    const { id } = data;

    try {
      await this.start();
      let model = await this.findOne(id, { include: { all: true } });
      let done = await model?.update(d, { include: { all: true }, transaction: this.transaction })


      if (done) {
        await this.commit();

        return done
      }
      else {
        this.rollback();
        return null
      }
    } catch (err: any) {

      this.rollback();
      throw err;
    }

  };

  public deleteBy = async (id: any | string): Promise<boolean> => {

    await this.start();

    const done = await this.repo.destroy({
      where: { id },
      transaction: this.transaction
    });

    if (done) {
      await this.commit();

      return done == 1;

    }
    else {
      this.rollback();
      return false
    }

  };

  public findOneBy = async (options: any): Promise<any> => {
    try {
      const data: M | undefined = await this.repo.findOne(options);
      return data;
    } catch (e) {
      const x = e;
      return null;
    }
  };

  public findAll = async (options: any): Promise<T[] | any> => {
    const { where, include, attributes, limit = 6, offset = 0 } = options;
    const data: T[] = await this.repo.findAll({
      where,
      include,
      attributes: attributes ? Array.isArray(attributes) ? attributes : (attributes)?.split(',') : undefined,
      offset: Number(offset),
      limit: Number(limit),
    });
    return data;
  };
  public findAllBy = async (options: any): Promise<T[] | undefined> => {
    const { where, include, attributes, limit = 6, offset = 0 } = options;
    return await this.repo.findAll({
      where,
      attributes,
      include,
      offset,
      limit,
    });
  };

  public paginate = async (
    options: any
  ): Promise<Paginate<T> | undefined> => {
    let {
      group,
      where,
      attributes,
      include,
      scope,
      exclude = [],
      pageSize = 6,
      page = 1,
      order = [["createdAt", "DESC"]],
    } = options;
    //where = this.repo?.?.filter(where);
    const limit = Number(pageSize);

    const offset =
      Number(page) < 1
        ? 0
        : Number(page) > limit
          ? limit
          : (Number(page) - 1) * limit;

    const fromScope = scope ?
      this.repo.scope(scope) : this.repo;

    return new Paginate(
      await fromScope.findAll(
        {
          subQuery: false,
          where,
          attributes: attributes
            ? Array.isArray(attributes) ? attributes : attributes
              ?.split(",")
              .filter((x: string) => exclude.indexOf(x) === -1)
            : { exclude },
          group,
          include,
          offset,
          limit,
          order,
        }),
      Number(page),
      limit,
      await this.size({ scope, where })
    );
  };

  public findFirst = async (): Promise<T | undefined> => {
    const object = await this.repo.findOne({ order: [["createdAt", "DESC"]] });
    return object ?? undefined;
  };

  public findLast = async (): Promise<T | undefined> => {
    const object = await this.repo.findOne({ order: [["createdAt", "ASC"]] });
    return object ?? undefined;
  };

  public disableBy = async (
    id: any
  ): Promise<T | undefined | number | any> =>
    await this.repo.update({ isActive: false }, { where: { id } });

  public enableBy = async (id: any): Promise<T | undefined | number | any> =>
    await this.repo.update({ isActive: false }, { where: { id } });

  public clear = function (Model: ModelCtor<T>) {
    //  - Delete all the records from the collection
  };

  public size = async (options: any): Promise<number> => {
    const { where, include } = options;
    return await this.repo.count({ where, include });
  };

  public classOf = (className: string) => eval(className);
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

// find a better place to put this
function roundUp(num: number, precision: number = 0) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

roundUp(192.168, 1); //=> 192.2
