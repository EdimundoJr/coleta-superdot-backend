import { object, string, z } from "zod";

export const getResearcherNameBySampleIdSchema = object({
    params: object({ sampleId: string() }),
});

export type GetResearcherNameBySampleIdDTO = z.infer<typeof getResearcherNameBySampleIdSchema>;
