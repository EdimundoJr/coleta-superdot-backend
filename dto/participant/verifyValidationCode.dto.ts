import { object, string, z } from "zod";

export const verifyValidationCodeSchema = object({
    params: object({
        sampleId: string({
            required_error: "Sample id param is required!",
        }),
        participantId: string({
            required_error: "Participant email is required!",
        }),
        verificationCode: string({
            required_error: "Verification code is required!",
        }),
    }),
});

export type VerifyValidationCodeDTO = z.infer<typeof verifyValidationCodeSchema>;
