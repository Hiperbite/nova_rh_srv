
import { Contact, Employee } from "../../models/index";
import IRepository from "../irepository";
import Repository from "../repository";

class EmployeeRepository extends Repository<Employee> implements IRepository<Employee> {
    oneBy(query: any): Promise<Employee | undefined> {
        throw new Error("Method not implemented.");
    }

    /*constructor(private employee: Employee) {
      super();
    }*/

    private defaultOptions = async () => ({
        attributes: Object.keys(await Employee.describe()),
        include: [Contact],
    });

    one = async (id: string, options: any = {}): Promise<Employee | undefined> => {
        options = { ...options, ... await this.defaultOptions(), };
        const employee: Employee | undefined = await this.findOne(Employee, id, options);
        return employee;
    };

    create = async (data: any): Promise<Employee | undefined> => {
        
        return await this.createOne(Employee, data);
    };

    update = async (data: any): Promise<Employee | undefined> => {
        const {
            id,
            title,
            category,
            text,
            isActive = true,
            cover,
            user: { id: userId },
        } = data;
        await this.updateOneBy(Employee, {
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
        return await this.deleteOneBy(Employee, data.id);
    };

    all = async (): Promise<Employee[] | undefined> => {
        const options = { include: null, attributes: null };

        const data: Employee[] | undefined = await this.findAll(Employee, options);
        return data;
    };

    allBy = async (query: any): Promise<Employee[] | undefined> => {
        const where = query;
        const options = { include: null, attributes: {}, where };

        const data: Employee[] | undefined = await this.findAll(Employee, {});
        return data;
    };

    first = async (): Promise<Employee | undefined> => await this.findFirst(Employee);
    last = async (): Promise<Employee | undefined> => await this.findLast(Employee);
    disable = async (data: any): Promise<Employee | undefined> =>
        await this.disableBy(Employee, data.id);
    enable = async (data: any): Promise<Employee | undefined> =>
        await this.enableBy(Employee, data.id);

    clear = async () => {
        return true;
    };
}
export default new EmployeeRepository();