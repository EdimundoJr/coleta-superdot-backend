import { object, string, z } from "zod";

export const getInfoSchema = object({
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
});

export type GetInfoDTO = z.infer<typeof getInfoSchema>;
