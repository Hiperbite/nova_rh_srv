import { Request, Response } from "express";
import { Employee } from "../../models/index";
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

        const employee: Employee = await EmployeeRepository.create(body);

        return res.json(employee)
    }
    update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const { body } = req;

        const employee = await Employee.findByPk(id);

        if(employee)
            await EmployeeRepository.update(employee, body);
            
        employee?.update(body, { returning: true });

        const updatedEmployee = await Employee.findByPk(id);
        return res.json(updatedEmployee);
    }
    find = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const employee: Employee | null = await Employee.findByPk(id);
        return res.json(employee)
    }
    findBy = async (req: Request, res: Response): Promise<Response> => {
        const employees: Array<Employee> = await Employee.findAll();
        return res.json(employees)
    }

}

export default new EmployeeApi();
export { EmployeeApi };