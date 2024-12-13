import { object, string, z } from "zod";

/** VALIDATE E-MAIL IN SAMPLE*/
export const sendValidationEmailSchema = object({
    body: object({
        participantEmail: string({
            required_error: "Email is required!",
        }).email("Email is invalid!"),
    }),
    params: object({
        sampleId: string({
            required_error: "Sample id param is required!",
        }),
    }),
});

export type SendValidationEmailDTO = z.infer<typeof sendValidationEmailSchema>;
