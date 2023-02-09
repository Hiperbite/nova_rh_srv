import sendEmail from "../../application/mailler";
import { Contact, Employee, User } from "../../models/index";
import { UserRepository } from "../index";
import IRepository from "../irepository";
import Repository from "../repository";
import contactRepository from "./contact.repository";

class EmployeeRepository
  extends Repository<Employee>
  implements IRepository<Employee>
{
  oneBy=(query: any): Promise<Employee | undefined> =>{
    throw new Error("Method not implemented.");
  }

  constructor() {
    super(Employee);
  }

  private defaultOptions = async () => ({
    attributes: Object.keys(await Employee.describe()),
    include: [Contact, User],
  });

  one = async (
    id: string,
    { attributes }: any = {}
  ): Promise<Employee | undefined> => {
    const options = { ...(await this.defaultOptions()), attributes };
    const employee: Employee | undefined = await this.findOne(id, options);
    return employee;
  };

  create = async (data: any): Promise<Employee | undefined> => {
    const employee = await this.createOne(data);
    if (employee?.id !== undefined) {
      const contacts = data?.contacts.map(
        async (contact: any) =>
          await contactRepository.create({
            ...contact,
            ...{ employeeId: employee.id },
          })
      );
      employee.contacts = contacts;

      if (employee.user === undefined) {
        const user = await UserRepository.create({
          password: null,
          username: `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase()}`,
          employeeId: employee.id,
          email: data?.contacts[0].descriptions,
          role: "ROLE_USER",
        });

        employee.userId = user?.id;
        if (user?.id)
          await sendEmail({
            to: user?.email,
            from: "test@example.com",
            subject: "Verify your email",
            text: `verification code: ${user?.verificationCode}. Id: ${user?.id}`,
          });
      }
    }
    return employee;
  };

  update = async (data: any): Promise<Employee | undefined> => {
    return await this.updateOne(data);
    //  return await this.findOne(id);
  };

  delete = async (data: any): Promise<boolean> => {
    return await this.deleteBy(data.id);
  };

  all = async (opts:any={}): Promise<Employee[] | undefined> => {
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

  first = async (): Promise<Employee | undefined> => await this.first();
  last = async (): Promise<Employee | undefined> => await this.last();
  disable = async (data: any): Promise<Employee | undefined> =>
    await this.disable(data.id);
  public enable = async (data: any): Promise<Employee | undefined> =>
    await this.enable(data.id);

  clear = async () => {
    return true;
  };
}
export default EmployeeRepository;
