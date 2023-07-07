
import { Employee, Person } from "../../models/index";

import Api from "../Api";

class EmployeeApi extends Api<Employee> {
  constructor() { super(Employee) }
}

export default new EmployeeApi();

export { EmployeeApi };
