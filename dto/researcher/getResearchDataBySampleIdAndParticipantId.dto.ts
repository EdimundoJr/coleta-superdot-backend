import { object, string, z } from "zod";

export const getResearchDataBySampleIdAndParticipantIdSchema = object({
    params: object({ sampleId: string(), participantId: string() }),
});

export type GetResearchDataBySampleIdAndParticipantIdDTO = z.infer<
    typeof getResearchDataBySampleIdAndParticipantIdSchema
>;
