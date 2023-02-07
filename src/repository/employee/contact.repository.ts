
import { Contact } from "../../models/index";
import IRepository from "../irepository";
import Repository from "../repository";

class ContactRepository extends Repository<Contact> implements IRepository<Contact> {
    oneBy(query: any): Promise<Contact | undefined> {
        throw new Error("Method not implemented.");
    }

    constructor() {
      super(Contact);
    }

    private defaultOptions = async () => ({
        attributes: Object.keys(await Contact.describe()),
        include: [Contact],
    });

    one = async (id: string, options: any = {}): Promise<Contact | undefined> => {
        options = { ...options, ... await this.defaultOptions(), };
        const contact: Contact | undefined = await this.findOne(id, options);
        return contact;
    };

    create = async (data: any): Promise<Contact | undefined> => {
        
        const contact = await this.createOne(data);
        return contact;
    };

    update = async (data: any): Promise<Contact | undefined> => {
        const {
            id,
            title,
            category,
            text,
            isActive = true,
            cover,
            user: { id: userId },
        } = data;
        await this.updateOneBy({
            id,
            title,
            category,
            text,
            cover,
            isActive,
            userId,
        });
        return await this.one(id);
    };

    delete = async (data: any): Promise<boolean> => {
        return await this.deleteOneBy(data.id);
    };

    all = async (): Promise<Contact[] | undefined> => {
        const options = { include: null, attributes: null };

        const data: Contact[] | undefined = await this.findAll(options);
        return data;
    };

    allBy = async (query: any): Promise<Contact[] | undefined> => {
        const where = query;
        const options = { include: null, attributes: {}, where };

        const data: Contact[] | undefined = await this.findAll({});
        return data;
    };

    first = async (): Promise<Contact | undefined> => await this.findFirst();
    last = async (): Promise<Contact | undefined> => await this.findLast();
    disable = async (data: any): Promise<Contact | undefined> =>
        await this.disableBy(data.id);
    enable = async (data: any): Promise<Contact | undefined> =>
        await this.enableBy(data.id);

    clear = async () => {
        return true;
    };
}
export default new ContactRepository();