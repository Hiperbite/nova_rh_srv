import {string, object, TypeOf} from "zod";

const infoRequired = "Campo obrigatório";

export const attendanceCreateSchema = object({
    body: object({
        typeId: string({required_error: infoRequired}).min(1, "typeId inválido"),
        employeeId: string({required_error: infoRequired}).min(1, "employeeId inválido"),
        approverId:string({required_error: infoRequired}).min(1, "approverId inválido").optional(),
        startDate: string({required_error: infoRequired}).min(1, "startDate inválido"),
        endDate: string({required_error: infoRequired}).min(1, "endDate inválido")
    })
})

export type attendanceCreateInput = TypeOf<typeof attendanceCreateSchema>["body"];