import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string().min(4).max(20),
    password: string({
      required_error: "Password is required",
    }).min(4, "Invalid email or password"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];