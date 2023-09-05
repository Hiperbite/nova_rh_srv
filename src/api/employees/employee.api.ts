
import { Request, Response } from "express";
import { Employee, Contract, User } from "../../models/index";

import Api from "../Api";

class EmployeeApi extends Api<Employee> {
  constructor() { super(Employee) }
  
  closeContract = async (req: Request, res: Response): Promise<Response> => {
    const message = "Usuário desabilitado com Sucesso";
    const {id} = req.params;

    await Contract.update({ isActive: false}, {where: {employeeId: id, isActive: true}});        
    
    await Employee.update({isActive: false}, { where: { id: id }, returning: true });        

    await User.update({isActive: false}, {where: {employeeId: id}});

    return res.status(200).json(message);
  }
}

export default new EmployeeApi();

export { EmployeeApi };
