import { object, string, z } from "zod";

export const getInfoSchema = object({
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
});

export const getInfoBioSchema = object({
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
        participantId: string({ required_error: "Participant id param is required!" }),
    }),
});

export type GetInfoDTO = z.infer<typeof getInfoSchema>;
export type GetInfoBioDTO = z.infer<typeof getInfoBioSchema>;
