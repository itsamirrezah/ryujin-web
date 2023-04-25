import { z, ZodType } from "zod";

interface ISignUpSchema {
    username: string,
    email: string,
    password: string
}

const signUpSchema: ZodType<ISignUpSchema> = z.object({
        username: z.string().min(6).max(20),
        email: z.string().email(),
        password: z.string().min(8).max(20)
    })

export {signUpSchema}

export type {ISignUpSchema}
