import { array, number, object, optional, string, z } from "zod";
import {
    DEVICES_ARRAY,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    MARITAL_STATUS_ARRAY,
} from "../../util/consts";
import validator from "validator";
import { DateTime } from "luxon";

const partcipantDataBody = object({
    personalData: object({
        fullName: optional(string().trim()),
        phone: optional(string()),
        email: optional(string().email({ message: "Email invalid" })),
        maritalStatus: optional(z.enum(MARITAL_STATUS_ARRAY)),
        job: optional(string()),
        occupation: optional(string()),
        educationLevel: optional(z.enum(EDUCATION_LEVEL_ARRAY)),
        gender: optional(z.enum(GENDER_ARRAY)),
        birthDate: optional(
            string().transform((val, ctx) => {
                if (!validator.isISO8601(val)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Invalid date!",
                    });
                }

                return DateTime.fromISO(val).toJSDate();
            })
        ),
    }),
    familyData: object({
        qttChildrens: optional(number().or(string().transform((str, ctx) => Number(str)))),
        qttSiblings: optional(number().or(string().transform((str, ctx) => Number(str)))),
        qttFamilyMembers: optional(string()),
        familyMonthIncome: optional(z.enum(INCOME_LEVELS_ARRAY)),
        houseDevices: optional(array(z.enum(DEVICES_ARRAY))),
        outsideHouseDevices: optional(array(z.enum(DEVICES_ARRAY))),
    }),
    addressData: object({
        city: optional(string()),
        district: optional(string()),
        street: optional(string()),
        houseNumber: optional(string()),
    }),
});

const participantDataParams = object({
    sampleId: string(),
    participantId: string().optional(),
});

export const participantDataSchema = object({
    body: partcipantDataBody,
    params: participantDataParams,
});

export type ParticipantDataDTO = z.infer<typeof participantDataSchema>;
