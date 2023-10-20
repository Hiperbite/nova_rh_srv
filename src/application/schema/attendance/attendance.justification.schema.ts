import {object, string, TypeOf} from  "zod";

const infoRequire = "Campo Obrigatório";

export const justificationCreateSchema = object({
    body: object({
        description: string({required_error: infoRequire}).min(3, "Descrição inválida"),
        attendanceId: string({required_error: "AttendanceId é obrigatório"})
    })  
})

export const justificationUpdateSchema = object({
    params: object({
        id: string(),
    }),
    body: object({
        description: string({required_error: infoRequire}).min(3, "Descrição Inválida"),
    })
})

export type justificationCreateInput =  TypeOf<typeof justificationCreateSchema>["body"];
export type justificationUpdateInput = TypeOf<typeof justificationUpdateSchema>;


