import { object, string, z } from "zod";

export const sendValidationSecondSourceEmailSchema = object({
    body: object({
        secondSourceEmail: string({
            required_error: "Email is required!",
        }).email("Email is invalid!"),
    }),
    params: object({
        sampleId: string({
            required_error: "Sample id param is required!",
        }),
        participantId: string({
            required_error: "participant id param is required!",
        }),
    }),
});

export type SendValidationSecondSourceEmailDTO = z.infer<typeof sendValidationSecondSourceEmailSchema>;
