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
    username: z.union([
        z.string()
            .trim()
            .toLowerCase()
            .min(6, { message: "must contain at least 6 characters" })
            .max(30, { message: "must contain less than 20 characters" })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: 'can only contain letters, numbers and underscores',
            }),
        z.string().email({ message: "enter a valid email" })
    ]),
    password: z.string()
        .min(8, { message: "must contain at least 8 characters" })
        .max(30, { message: "must contain less than 30 characters" })
})

const usernameSchema: ZodType<{ username: string }> = z.object({
    username: z.string().min(6).max(20)
})

export { signUpSchema, signInSchema, usernameSchema }

export type { ISignUpSchema, ISignSchema }
