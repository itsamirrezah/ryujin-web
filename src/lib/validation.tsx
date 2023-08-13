import { z, ZodType } from "zod";

type ISignSchema = {
    username: string,
    password: string
}

type ISignUpSchema = {
    email: string,
} & ISignSchema

const signUpSchema: ZodType<ISignUpSchema> = z.object({
    username: z.string().min(6).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(20)
})

const signInSchema: ZodType<ISignSchema> = z.object({
    username: z.string().min(6).max(20),
    password: z.string().min(8).max(20)
})

const usernameSchema: ZodType<{ username: string }> = z.object({
    username: z.string().min(6).max(20)
})

export { signUpSchema, signInSchema, usernameSchema }

export type { ISignUpSchema, ISignSchema }
