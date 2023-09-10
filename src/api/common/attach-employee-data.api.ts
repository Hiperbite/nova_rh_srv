import { Request, Response } from "express";
import { generateDocument } from "../../application/common/docs-generate/document.app";
import { Employee } from "../../models/index";
import { z, AnyZodObject } from "zod";

const infoRequire = "Campo Obrigatório"

const personalDataSchema =
  z.object({
    firstName: z.string({ required_error: infoRequire }).min(2, "Nome inválido").max(100, "Nome muito extenso"),
    lastName: z.string({ required_error: infoRequire }).min(2, "Sobrenome inválido").max(100, "Sobrenome muito extenso"),
    gender: z.string({ required_error: infoRequire }),
    nationality: z.string({ required_error: infoRequire }).min(2, "Nacionalidade inválida").max(100, "Nacionalidade inválida"),
    birthDate: z.string({ required_error: infoRequire }).min(10, "Data de nascimento inválida")
  })

const contactSchema = z.array(z.object({
  type: z.string({ required_error: infoRequire }).min(2, "Tipo de contacto inválido").max(10, "Tipo de contacto inválido"),
  descriptions: z.string({ required_error: infoRequire }).min(2, "Descrição do contacto inválido").max(20, "Descrição do contacto inválido")
}))

const documentSchema = z.array(z.object({
  type: z.string({ required_error: infoRequire }).min(2, "Tipo de documento inválido").max(10, "Tipo de documento inválido"),
  number: z.string({ required_error: infoRequire }).min(2, "Número de documento inválido").max(20, "Número de documento inválido")
}))

const employeeSchema = z.object({
  person: personalDataSchema,
  documents: documentSchema,
  contacts: contactSchema
});

const validateSchema = async (employee: AnyZodObject) => {

  try {
    await employeeSchema.parseAsync(
      employee
    );
    return employee;
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

      await validateSchema(employee)

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
