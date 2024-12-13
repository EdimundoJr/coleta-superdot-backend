import { object, string, z } from "zod";

export const loginDTO = object({
    body: object({
        email: string({
            required_error: "Email is required!",
        }).email("Email is invalid!"),
        password: string({
            required_error: "Password is required",
        }).min(8, "Password too short - should be 8 chars minimium"),
    }),
});

const userRoleParams = object({
    userId: string(),
});

export const userRoleDTO = object({
    params: userRoleParams,
});

const setUserRoleBody = object({
    userId: string({
        required_error: "A user id is necessary.",
    }),
    newRole: string({
        required_error: "New role is required!",
    }),
    emailMessage: string().optional(),
});

export const setUserRoleDTO = object({
    body: setUserRoleBody,
});

export type LoginDTO = z.infer<typeof loginDTO>;
export type UserRoleDTO = z.infer<typeof userRoleDTO>;
export type SetUserRoleDTO = z.infer<typeof setUserRoleDTO>;
