import { z, ZodType } from "zod";

type SignSchema = {
    username: string,
    password: string
}

type SignUpSchema = {
    email: string,
    confirm: string,
} & SignSchema

type UpdateUsernameSchema = {
    username: string
}


const zUsername = z.string()
    .toLowerCase()
    .min(6, { message: "must contain at least 6 characters" })
    .max(30, { message: "must contain less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'can only contain letters, numbers and underscores',
    });

const zPassword = z.string()
    .min(8, { message: "must contain at least 8 characters" })
    .max(30, { message: "must contain less than 30 characters" })

const zEmail = z.string().email({ message: "enter a valid email" })

const signUpSchema: ZodType<SignUpSchema> = z.object({
    username: zUsername,
    email: zEmail,
    password: zPassword,
    confirm: z.string(),
}).refine(({ password, confirm }) => password === confirm, { message: "passwords do not match", path: ["confirm"] })

const signInSchema: ZodType<SignSchema> = z.object({
    username: z.union([zUsername, zEmail]),
    password: zPassword
})

const usernameSchema: ZodType<{ username: string }> = z.object({
    username: zUsername
})

export { signUpSchema, signInSchema, usernameSchema }

export type { SignUpSchema, SignSchema, UpdateUsernameSchema }
