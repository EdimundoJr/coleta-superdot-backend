import { object, string, z } from "zod";

export const acceptAllSampleDocsSchema = object({
    params: object({
        sampleId: string({ required_error: "Sample id param is required!" }),
    }),
});

export type AcceptAllSampleDocsDTO = z.infer<typeof acceptAllSampleDocsSchema>;
