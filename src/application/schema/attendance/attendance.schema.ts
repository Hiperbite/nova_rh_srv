import { string, object, TypeOf, number } from "zod";

const infoRequired = "Campo obrigatório";

export const attendanceCreateSchema = object({
    body: object({
        typeId: string({ required_error: infoRequired }).min(1, "typeId inválido"),
        employeeId: string({ required_error: infoRequired }).min(1, "employeeId inválido"),
        approverId: string({ required_error: infoRequired }).min(1, "approverId inválido").optional(),
        startDate: string({ required_error: infoRequired }).min(1, "startDate inválido"),
        endDate: string({ required_error: infoRequired }).min(1, "endDate inválido")
    })
})

export type attendanceCreateInput = TypeOf<typeof attendanceCreateSchema>["body"];

export const frequencyCreateSchema = object({
    body: object({
        state: number({ required_error: infoRequired }),
        employeeId: string({ required_error: infoRequired }).min(1, "employeeId inválido"),
        startDate: string({ required_error: infoRequired }).min(1, "startDate inválido"),
        endDate: string({ required_error: infoRequired }).min(1, "endDate inválido")
    }).refine((data) => data.endDate >= data.startDate, {
        message: "Datas inválidas",
        path: ['Data de fim']
    })
})

export type frequencyCreateInput = TypeOf<typeof frequencyCreateSchema>["body"];