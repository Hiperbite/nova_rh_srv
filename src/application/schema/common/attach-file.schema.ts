import { object, string, TypeOf, array, z } from "zod";

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

export const employeeSchema = z.object({
  person: personalDataSchema,
  documents: documentSchema,
  contacts: contactSchema
});

export const departmentSchema = object({
  code: string({
    required_error: "Código é obrigatório",
  }),
  departmentId: string({
    required_error: "",
  }).optional(),
  descriptions: string({
    required_error: "Descrição é obrigatória",
  })
});

export const attachDepartmentSchema = object({
  body: object({
    departments: array(departmentSchema)
  })
});

export type attachEmployeeInput = TypeOf<typeof employeeSchema>;
export type attachDepartmentInput = TypeOf<typeof attachDepartmentSchema>["body"];

