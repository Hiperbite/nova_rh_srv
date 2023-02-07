import { Request, Response } from "express";
import { Employee, Contact } from "../../models/index";
import { EmployeeRepository } from "../../repository/index";
interface IApi {
    create(req: Request, res: Response): Response;
    update(req: Request, res: Response): Response;
    find(req: Request, res: Response): Response;
    findBy(req: Request, res: Response): Response;
}
class EmployeeApi {
    create = async (req: Request, res: Response): Promise<Response> => {
        const { body } = req;

        const employee: Employee | void = await EmployeeRepository.create(body);

        return res.json(employee)
    }
    update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const { body } = req;

        const employee = await EmployeeRepository.update({ ...body, id });

        const updatedEmployee = await EmployeeRepository.one(id);

        await updatedEmployee?.update(body, { returning: true })

        return res.json(updatedEmployee);
    }
    find = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const { query } = req;

        const employee: Employee | undefined = await EmployeeRepository.one(id, query);
        return res.json(employee)
    }
    findBy = async (req: Request, res: Response): Promise<Response> => {
        const employees: Array<Employee> | undefined = await EmployeeRepository.all();
        return res.json(employees)
    }

}

export default new EmployeeApi();
export { EmployeeApi };