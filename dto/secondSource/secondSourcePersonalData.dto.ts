import { object, string, z } from "zod";
import validator from "validator";
import { DateTime } from "luxon";
import { EDUCATION_LEVEL_ARRAY, RELATIONSHIPS_ARRAY, RELATIONSHIP_TIME_ARRAY } from "../../util/consts";

const secondSourcePersonalDataBody = object({
    personalData: object({
        fullName: string({ required_error: "Full name is required!" }),
        birthDate: string({
            required_error: "Birth date is required",
        }).transform((val, ctx) => {
            if (!validator.isISO8601(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid date!",
                });
            }

            return DateTime.fromISO(val).toJSDate();
        }),
        relationship: z.enum(RELATIONSHIPS_ARRAY, { required_error: "The relationship is required!" }),
        relationshipTime: z.enum(RELATIONSHIP_TIME_ARRAY, { required_error: "The relationship time is required!" }),
        job: string({ required_error: "Job is required" }),
        occupation: string({ required_error: "Occupation is required" }),
        street: string({ required_error: "Street is required" }),
        district: string({ required_error: "District is required" }),
        countryCity: string({ required_error: "City is required" }),
        phone: string({ required_error: "Phone is required" }),
        educationLevel: z.enum(EDUCATION_LEVEL_ARRAY, { required_error: "Education level is required" }),
    }),
});

export const saveSecondSourcePersonalDataSchema = object({
    body: secondSourcePersonalDataBody.deepPartial(),
    params: object({
        sampleId: string({
            required_error: "Sample id param is required!",
        }),
    }),
});

export const submitSecondSourcePersonalDataSchema = object({
    body: secondSourcePersonalDataBody,
    params: object({
        sampleId: string({
            required_error: "Sample id param is required!",
        }),
    }),
});

export type SaveSecondSourcePersonalDataDTO = z.infer<typeof saveSecondSourcePersonalDataSchema>;
export type SubmitSecondSourcePersonalDataDTO = z.infer<typeof submitSecondSourcePersonalDataSchema>;
