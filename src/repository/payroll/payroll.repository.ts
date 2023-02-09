import { Payroll } from "../../models/index";

import IRepository from "../irepository";
import Repository from "../repository";

class PayrollRepository
  extends Repository<Payroll>
  implements IRepository<Payroll>
{
  oneBy(query: any): Promise<Payroll | undefined> {
    throw new Error("Method not implemented.");
  }

  constructor() {
    super(Payroll);
  }

  private defaultOptions = async () => ({
    attributes: Object.keys(await Payroll.describe()),
    include: [],
  });

  one = async (
    id: string,
    { attributes }: any = {}
  ): Promise<Payroll | undefined> => {
    const options = { ...(await this.defaultOptions()), attributes };
    const payroll: Payroll | undefined = await this.findOne(id, options);
    return payroll;
  };

  create = async (data: any): Promise<Payroll | undefined> => {
    const payroll = await this.createOne(data);

    return payroll;
  };

  update = async (data: any): Promise<Payroll | undefined> => {
    return await this.updateOneBy(data);
    //  return await this.one(id);
  };

  delete = async (data: any): Promise<boolean> => {
    return await this.deleteOneBy(data.id);
  };

  all = async ({ attributes = {} }: any = {}): Promise<
    Payroll[] | undefined
  > => {
    const options = { ...(await this.defaultOptions()), attributes };

    const data: Payroll[] | undefined = await this.findAll(options);
    return data;
  };

  allBy = async (query: any): Promise<Payroll[] | undefined> => {
    const { where, attributes } = query;
    const options = { ...(await this.defaultOptions()), attributes, where };

    const data: Payroll[] | undefined = await this.findAll({});
    return data;
  };

  first = async (): Promise<Payroll | undefined> => await this.findFirst();
  last = async (): Promise<Payroll | undefined> => await this.findLast();
  disable = async (data: any): Promise<Payroll | undefined> =>
    await this.disableBy(data.id);
  enable = async (data: any): Promise<Payroll | undefined> =>
    await this.enableBy(data.id);

  clear = async () => {
    return true;
  };
}
export default PayrollRepository;
