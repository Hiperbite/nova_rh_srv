import sendEmail from "../../application/mailler";
import { Contact, TransactionType, User } from "../../models/index";
import { UserRepository } from "../index";
import IRepository from "../irepository";
import Repository from "../repository";

class TransactionTypeRepository
  extends Repository<TransactionType>
  implements IRepository<TransactionType>
{
  oneBy(query: any): Promise<TransactionType | undefined> {
    throw new Error("Method not implemented.");
  }

  constructor() {
    super(TransactionType);
  }

  private defaultOptions = async () => ({
    attributes: Object.keys(await TransactionType.describe()),
    include: [],
  });

  one = async (
    id: string,
    { attributes }: any = {}
  ): Promise<TransactionType | undefined> => {
    const options = { ...(await this.defaultOptions()), attributes };
    const transactionType: TransactionType | undefined = await this.findOne(
      id,
      options
    );
    return transactionType;
  };

  create = async (data: any): Promise<TransactionType | undefined> => {
    const transactionType = await this.createOne(data);

    return transactionType;
  };

  update = async (data: any): Promise<TransactionType | undefined> => {
    return await this.updateOneBy(data);
    //  return await this.one(id);
  };

  delete = async (data: any): Promise<boolean> => {
    return await this.deleteOneBy(data.id);
  };

  all = async ({ attributes = {} }: any = {}): Promise<
    TransactionType[] | undefined
  > => {
    const options = { ...(await this.defaultOptions()), attributes };

    const data: TransactionType[] | undefined = await this.findAll(options);
    return data;
  };

  allBy = async (query: any): Promise<TransactionType[] | undefined> => {
    const { where, attributes } = query;
    const options = { ...(await this.defaultOptions()), attributes, where };

    const data: TransactionType[] | undefined = await this.findAll({});
    return data;
  };

  first = async (): Promise<TransactionType | undefined> =>
    await this.findFirst();
  last = async (): Promise<TransactionType | undefined> =>
    await this.findLast();
  disable = async (data: any): Promise<TransactionType | undefined> =>
    await this.disableBy(data.id);
  enable = async (data: any): Promise<TransactionType | undefined> =>
    await this.enableBy(data.id);

  clear = async () => {
    return true;
  };
}
export default TransactionTypeRepository;
