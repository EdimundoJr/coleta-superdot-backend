import { object, string, z } from "zod";

export const validateSecondSourceVerificationCodeSchema = object({
    params: object({
        sampleId: string({
            required_error: "Sample id param is required!",
        }),
        participantId: string({
            required_error: "Participant email is required!",
        }),
        secondSourceId: string({
            required_error: "Second source id param is required!",
        }),
        verificationCode: string({
            required_error: "Verification code is required!",
        }),
    }),
});

export type ValidateSecondSourceVerificationCodeDTO = z.infer<typeof validateSecondSourceVerificationCodeSchema>;
