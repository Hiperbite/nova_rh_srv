import { departmentSchema, employeeSchema } from './../../application/schema/common/attach-file.schema';
import { Request, Response } from "express";
import { generateDocument } from "../../application/common/docs-generate/document.app";
import { Department, Employee } from "../../models/index";
import { z, AnyZodObject } from "zod";



const validateEmployeeSchema = async (employee: AnyZodObject) => {

  try {
    await employeeSchema.parseAsync(
      employee
    );
    return employee;
  } catch (error: any) {
    throw (error)
  }

}

const validateDepartmentSchema = async (department: AnyZodObject) => {

  try {
    await departmentSchema.parseAsync(
      department
    );
    return department;
  } catch (error: any) {
    throw (error)
  }

}

export async function attachEmployeeData(req: Request, res: Response) {
  const errors: any = [];
  let contError: number = 0;
  let employee: any;

  const data = req.body.employees;

  for (employee of data) {
    try {

      await validateEmployeeSchema(employee)

    } catch (error: any) {
      contError++;
      errors.push({
        model: data.indexOf(employee),
        errors: error.issues
      });
    }
  }

  if (contError > 0) {
    res.json({
      errors: errors,
      created: 0,
    });
  } else {

    for (employee of data)
      await Employee.create(employee, { include: { all: true } })

    res.json({
      errors: errors,
      created: data.length,
    });
  }

}


export async function attachDepartmentData(req: Request, res: Response) {
  const errors: any = [];
  let contError: number = 0;
  let department: any;

  const data = req.body.departments;

  for (department of data) {
    try {

      await validateDepartmentSchema(departmentSchema)

    } catch (error: any) {
      contError++;
      errors.push({
        model: data.indexOf(department),
        errors: error.issues
      });
    }
  }

  if (contError > 0) {
    res.json({
      errors: errors,
      created: 0,
    });
  } else {

    for (department of data)
      await Department.create(department, { include: { all: true } })

    res.json({
      errors: errors,
      created: data.length,
    });
  }

}
