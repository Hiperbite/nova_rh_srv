import { Model as M, ModelCtor } from "sequelize-typescript";

export default class Repository<T extends M> {
  protected findOne = async (
    Model: ModelCtor<T>,
    id: string,
    { attributes, exclude, include }: any
  ): Promise<T | undefined> => {
    const options = {
      include,
      attributes: attributes
        ? attributes
            ?.split(",")
            .filter((x: string) => exclude.indexOf(x) === -1)
        : { exclude },
    };

    const data = await Model.findByPk(id, options);

    return data ?? undefined;
  };

  protected createOne = async (
    Model: ModelCtor<T>,
    data: any
  ): Promise<T | undefined | any> => {
    
    try {
      return await Model.create(data);
    } catch (err: any) {
      if (err.errors)
        throw err.errors.map(
          ({
            message,
            type,
            path,
            value,
            origin,
            validatorKey,
            validatorName,
            validatorArgs,
          }: any) => ({
            message,
            type,
            path,
            value,
            origin,
            validatorKey,
            validatorName,
            validatorArgs,
          })
        );
      else throw err;
    }
  };

  protected updateOneBy = async (
    Model: ModelCtor<T>,
    data: any
  ): Promise<number> => {
    const { ["id"]: _, ...d } = data;
    const { id } = data;
    const model = await Model.update(d, { where: { id } });
    return model ? 1 : 0;
  };

  protected deleteOneBy = async (
    Model: ModelCtor<T>,
    id: any | string
  ): Promise<boolean> => {
    const model = await Model.destroy({
      where: { id },
      truncate: true,
    });

    return model == 1;
  };
  protected findOneBy = async (
    Model: ModelCtor<T>,
    options: any
  ): Promise<any> => {
    try {
      const data: M | undefined = await Model.findOne(options);
      return data;
    } catch (e) {
      const x = e;
      return null;
    }
  };

  protected findAll = async (
    Model: ModelCtor<T>,
    options: any
  ): Promise<T[] | any> => {
    const { where, include, attributes, limit = 6, offset = 0 } = options;
    const data: T[] = await Model.findAll({
      where,
      include,
      attributes,
      offset,
      limit,
    });
    return data;
  };
  protected findAllBy = async (
    Model: ModelCtor<T>,
    options: any
  ): Promise<T[] | undefined> => {
    const { where, include, attributes, limit = 6, offset = 0 } = options;
    return await Model.findAll({ where, attributes, include, offset, limit });
  };
  protected paginate = async (
    Model: ModelCtor<T>,
    options: any
  ): Promise<Paginate<T> | undefined> => {
    const {
      where,
      attributes,
      include,
      exclude,
      pageSize = 6,
      page = 1,
      order = [["createdAt", "DESC"]],
    } = options;

    const limit = Number(pageSize);

    const offset =
      Number(page) < 1
        ? 0
        : Number(page) > limit
        ? limit
        : (Number(page) - 1) * limit;

    return new Paginate(
      await Model.findAll({
        where,
        attributes: attributes
          ? attributes
              ?.split(",")
              .filter((x: string) => exclude.indexOf(x) === -1)
          : { exclude },
        include,
        offset,
        limit,
        order,
      }),
      Number(page),
      limit,
      await this.size(Model, options)
    );
  };

  protected findFirst = async (Model: ModelCtor<T>): Promise<T | undefined> => {
    const object = await Model.findOne({ order: [["createdAt", "DESC"]] });
    return object ?? undefined;
  };

  protected findLast = async (Model: ModelCtor<T>): Promise<T | undefined> => {
    const object = await Model.findOne({ order: [["createdAt", "ASC"]] });
    return object ?? undefined;
  };

  protected disableBy = async (
    Model: ModelCtor<T>,
    id: any
  ): Promise<T | undefined | number | any> =>
    await Model.update({ isActive: false }, { where: { id } });

  protected enableBy = async (
    Model: ModelCtor<T>,
    id: any
  ): Promise<T | undefined | number | any> =>
    await Model.update({ isActive: false }, { where: { id } });

  protected clearAll = function (Model: ModelCtor<T>) {
    //  - Delete all the records from the collection
  };

  protected size = async (
    Model: ModelCtor<T>,
    options: any
  ): Promise<number> => {
    const { where } = options;
    return await Model.count({ where });
  };

  protected classOf = (className: string) => eval(className);
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