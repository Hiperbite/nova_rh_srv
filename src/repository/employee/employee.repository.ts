
import { Contact, Employee, User } from "../../models/index";
import IRepository from "../irepository";
import Repository from "../repository";
import contactRepository from "./contact.repository";

class EmployeeRepository extends Repository<Employee> implements IRepository<Employee> {
    oneBy(query: any): Promise<Employee | undefined> {
        throw new Error("Method not implemented.");
    }

    constructor() {
        super(Employee);
    }

    private defaultOptions = async () => ({
        attributes: Object.keys(await Employee.describe()),
        include: [Contact,User],
    });

    one = async (id: string, {attributes}: any = {}): Promise<Employee | undefined> => {
        const options = {... await this.defaultOptions(), attributes};
        const employee: Employee | undefined = await this.findOne(id, options);
        return employee;
    };

    create = async (data: any): Promise<Employee | undefined> => {

        const employee = await this.createOne(data);
        if (employee?.id !== undefined) {

            const contacts = data?.contacts.map(async (contact: any) => await contactRepository.create({ ...contact, ...{ employeeId: employee.id } }));
            employee.contacts = contacts;
        }
        return employee;
    };

    update = async (data: any): Promise<Employee | undefined> => {
        
        return await this.updateOneBy(data);
      //  return await this.one(id);
    };

    delete = async (data: any): Promise<boolean> => {
        return await this.deleteOneBy(data.id);
    };

    all = async (): Promise<Employee[] | undefined> => {
        const options = { include: null, attributes: null };

        const data: Employee[] | undefined = await this.findAll(options);
        return data;
    };

    allBy = async (query: any): Promise<Employee[] | undefined> => {
        const where = query;
        const options = { include: null, attributes: {}, where };

        const data: Employee[] | undefined = await this.findAll({});
        return data;
    };

    first = async (): Promise<Employee | undefined> => await this.findFirst();
    last = async (): Promise<Employee | undefined> => await this.findLast();
    disable = async (data: any): Promise<Employee | undefined> =>
        await this.disableBy(data.id);
    enable = async (data: any): Promise<Employee | undefined> =>
        await this.enableBy(data.id);

    clear = async () => {
        return true;
    };
}
export default new EmployeeRepository();