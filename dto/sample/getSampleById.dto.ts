import { object, string, z } from "zod";

export const getSampleByIdSchema = object({
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
});

export type GetSampleByIdDTO = z.infer<typeof getSampleByIdSchema>;
