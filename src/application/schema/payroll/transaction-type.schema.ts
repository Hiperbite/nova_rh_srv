import { any, array, z, object, string, TypeOf, boolean, number } from "zod";

export const createTransactionTypeSchema = object({
  body: object({
    name: string({
      required_error: "Name name is required",
    }),
    description: string({
      required_error: "Last name is required",
    }).optional(),
    value: number(),
    unit: string({
      required_error: "unit is required",
    }),
    debit: boolean({
      required_error: "ID Card is required",
    }).optional(),
    
  })
});
export const updateTransactionTypeSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }).optional().nullable(),
    lastName: string({
      required_error: "Last name is required",
    }).optional().nullable(),
    birthDate: any()/*date({
      required_error: "Birth date is required",
    })*/.optional().nullable(),
    nationality: string({
      required_error: "Nationality is required",
    }).optional().nullable(),
    idcard: string({
      required_error: "ID Card is required",
    }).optional().nullable(),


  }),
});


export type CreateTransactionTypeInput = TypeOf<typeof createTransactionTypeSchema>["body"];

export type UpdateTransactionTypeInput = TypeOf<typeof updateTransactionTypeSchema>["body"];

