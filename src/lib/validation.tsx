import { z, ZodType } from "zod";


interface ISignSchema {
    username: string,
    password: string
}

interface ISignUpSchema extends ISignSchema {
    email: string,
}

const signUpSchema: ZodType<ISignUpSchema> = z.object({
        username: z.string().min(6).max(20),
        email: z.string().email(),
        password: z.string().min(8).max(20)
    })

const signInSchema: ZodType<ISignSchema> = z.object({
        username: z.string().min(6).max(20),
        password: z.string().min(8).max(20)
    })

export {signUpSchema, signInSchema}

export type {ISignUpSchema, ISignSchema}
